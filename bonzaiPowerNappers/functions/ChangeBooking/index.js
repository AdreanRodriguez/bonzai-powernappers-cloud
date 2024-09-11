const { sendResponse, sendError } = require("../../responses/index.js");
const { getOrder } = require("../Utilities/getOrder.js");
const { deleteBookingInDb } = require("../Utilities/deleteBookingInDb.js");
const { updateRoomStatus } = require("../Utilities/updateRoomStatus.js");
const { getRoom } = require("../Utilities/getRoom.js");
const { addBookingToDb } = require("../Utilities/addBookingToDb.js");

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { nmbrOfGuests, roomTypes, checkIn, checkOut } = JSON.parse(event.body);

    if (!nmbrOfGuests || !roomTypes || !checkIn || !checkOut) {
      return sendError(
        404,
        "Missing required fields: checkIn, checkOut, roomTypes or nmbrOfGuests."
      );
    }
    const orderResponse = await getOrder(id);
    if (!orderResponse.success) {
      return sendError(404, orderResponse.message);
    }

    let totalPrice = 0;
    let nmbrOfBookedGuests = 0;
    const bookedRooms = [];

    const bookingInformation = {
      roomTypes,
      nmbrOfGuests,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      bookingId: orderResponse.items[0].orderId,
      guestEmail: orderResponse.items[0].guestEmail,
      guestName: orderResponse.items[0].guestName,
    };

    const nmbrOfBookedNights = Math.ceil(
      (bookingInformation.checkOut.getTime() - bookingInformation.checkIn.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    for (let i = 0; i < orderResponse.items.length; i++) {
      const deleteResponse = await deleteBookingInDb(orderResponse.items[i]);
      if (!deleteResponse.success) {
        return sendError(400, deleteResponse.message);
      }

      const updateResponse = await updateRoomStatus(orderResponse.items[i].bookedRoom, false);
      if (!updateResponse.success) {
        return sendError(401, updateResponse.message);
      }
    }

    for (let i = 0; i < roomTypes.length; i++) {
      const roomResponse = await getRoom(roomTypes[i]);
      if (!roomResponse.success) {
        return sendError(402, roomResponse.message);
      }

      const room = roomResponse.item;
      const updateResponse = await updateRoomStatus(room, true);
      if (!updateResponse.success) {
        return sendError(403, updateResponse.message);
      }
      delete room.isBooked;
      bookedRooms.push(room);
      totalPrice += room.price;
      nmbrOfBookedGuests += room.beds;
    }

    // if (nmbrOfBookedGuests !== nmbrOfGuests) {
    //     for (let i = 0; i < bookedRooms.length; i++) {
    //         const updateResponse = await updateRoomStatus(bookedRooms[i], true);
    //         if (!updateResponse.success) {
    //             return sendError(404, updateResponse.message);
    //         }
    //     }
    //     return sendError(405, "Not right amount of people booked");
    // }
    bookingInformation.bookedRooms = bookedRooms;
    bookingInformation.totalPrice = totalPrice *= nmbrOfBookedNights;

    for (let i = 0; i < bookedRooms.length; i++) {
      const bookingResponse = await addBookingToDb(bookingInformation, bookedRooms[i]);
      if (!bookingResponse.success) {
        return sendError(406, bookingResponse.message);
      }
    }
    return sendResponse(200, bookingInformation);
  } catch (error) {
    return sendError(407, error.message);
  }
};
