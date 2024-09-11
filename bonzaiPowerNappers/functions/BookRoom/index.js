const { sendResponse, sendError } = require("../../responses/index.js");
const { v4: uuid } = require("uuid");
const { getRoom } = require("../Utilities/getRoom.js");
const { addBookingToDb } = require("../Utilities/addBookingToDb.js");
const { updateRoomStatus } = require("../Utilities/updateRoomStatus.js");

exports.handler = async (event) => {
  try {
    const bookingId = uuid().substring(0, 8);

    const { checkIn, checkOut, roomTypes, guestName, guestEmail, nmbrOfGuests } = JSON.parse(
      event.body
    );

    if (checkIn && checkOut && roomTypes && guestName && guestEmail && nmbrOfGuests) {
      let totalPrice = 0;
      let nmbrOfBookedGuests = 0;

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const numberOfNights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const bookingInformation = {
        checkIn: checkInDate.toLocaleDateString("se-SV"),
        checkOut: checkOutDate.toLocaleDateString("se-SV"),
        bookingId,
        roomTypes,
        guestName,
        guestEmail,
        nmbrOfGuests,
      };

      const bookedRooms = [];

      for (let i = 0; i < roomTypes.length; i++) {
        const response = await getRoom(roomTypes[i]);
        if (response.success) {
          const room = response.item;
          const upResponse = await updateRoomStatus(room, true);
          if (upResponse.success) {
            delete room.isBooked;
            bookedRooms.push(room);
            nmbrOfBookedGuests += room.beds;
            totalPrice += room.price;
          } else {
            return sendError(400, upResponse.message);
          }
        } else {
          return sendError(404, response.message);
        }
      }

      if (nmbrOfBookedGuests === nmbrOfGuests) {
        bookingInformation.bookedRooms = bookedRooms;
        bookingInformation.totalPrice = totalPrice *= numberOfNights;
        for (let i = 0; i < bookedRooms.length; i++) {
          const response = await addBookingToDb(bookingInformation, bookedRooms[i]);
          if (!response.success) {
            return sendError(404, response.message);
          }
        }
        return sendResponse(200, bookingInformation);
      } else {
        for (let i = 0; i < bookedRooms.length; i++) {
          const response = await updateRoomStatus(bookedRooms[i], false);
          if (!response.success) {
            return sendError(404, response.message);
          }
        }
        return sendError(404, "Not right amount of people booked");
      }
    }
    return sendError(
      400,
      "Missing required fields: checkIn, checkOut, roomTypes, guestName, guestEmail, and number of guests."
    );
  } catch (error) {
    return sendError(404, error.message);
  }
};
