const { sendResponse, sendError } = require("../../responses/index.js");
const { db } = require("../../services/index.js");
const { v4: uuid } = require("uuid");

const { addBookingToDb } = require("../Utilities/addBookingToDb.js");
const { updateRoomStatus } = require("../Utilities/updateRoomStatus.js");

exports.handler = async (event) => {
  let totalPrice = 0;
  let nmbrOfBookedGuests = 0;

  const bookedRooms = [];
  const bookingId = uuid().substring(0, 8);

  try {
    const { checkIn, checkOut, roomTypes, guestName, guestEmail, nmbrOfGuests } = JSON.parse(
      event.body
    );

    if (checkIn && checkOut && roomTypes && guestName && guestEmail && nmbrOfGuests) {
      const bookingInformation = {
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        bookingId,
        roomTypes,
        guestName,
        guestEmail,
        nmbrOfGuests,
      };

      for (let i = 0; i > roomTypes.length; i++) {
        const response = await getRoom(roomTypes[i]);
        if (response.success) {
          const room = response.item;
          updateRoomStatus(room, true);
          bookedRooms.push(room);
          nmbrOfBookedGuests += room.beds;
          totalPrice += room.price;

          if (nmbrOfBookedGuests === nmbrOfGuests) {
            for (let i = 0; i < bookedRooms.length; i++) {
              const response = await addBookingToDb(bookingInformation, bookedRooms[i]);
              if (response.success) {
                bookingInformation.push(bookedRooms);
                totalPrice *=
                  bookingInformation.checkOut.getDay() - bookingInformation.checkIn.getDay();
              } else {
                updateRoomStatus(response.bookedRooms[i], false);
                return sendError(404, response.message);
              }
            }
            return sendResponse(200, bookingInformation);
          }
        } else {
          return sendError(404, response.message);
        }
      }
    }
    return sendError(
      400,
      "Missing required fields: checkIn, checkOut, roomTypes, guestName, guestEmail, and number of guests."
    );
  } catch (error) {
    return sendError(404, { message: error.message });
  }
};
