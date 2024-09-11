const { sendResponse, sendError } = require("../../responses/index.js");
const { getOrder } = require("../Utilities/getOrder.js");
const { deleteBookingInDb } = require("../Utilities/deleteBookingInDb.js");
const { updateRoomStatus } = require("../Utilities/updateRoomStatus.js");
const { deleteAndUpdateStatus } = require("../Utilities/deleteAndUpdateStatus.js")
const { getRoom } = require("../Utilities/getRoom.js");
const { addBookingToDb } = require("../Utilities/addBookingToDb.js");
const { compareNmbrOfPeople } = require("../Utilities/compareNmbrOfPeople.js");

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

        if (!compareNmbrOfPeople(nmbrOfGuests, roomTypes)) {
            return sendError(
                404,
                "Wrong amount of people booked."
            );
        }

        const orderResponse = await getOrder(id);
        if (!orderResponse.success) {
            return sendError(404, orderResponse.message);
        }

        let totalPrice = 0;
        const bookedRooms = [];

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const numberOfNights = Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const bookingInformation = {
            checkIn: checkInDate.toLocaleDateString("se-SV"),
            checkOut: checkOutDate.toLocaleDateString("se-SV"),
            bookingId: orderResponse.items[0].orderId,
            roomTypes,
            guestName: orderResponse.items[0].guestName,
            guestEmail: orderResponse.items[0].guestEmail,
            nmbrOfGuests,
        };

        const deleteUpdateResponse = await deleteAndUpdateStatus(orderResponse.items)
        if (!deleteUpdateResponse.success) {
            return sendError(400, deleteUpdateResponse.message)
        }



        // const {success, bookedRooms, totalPrice, message } = funcName(roomTypes)
        // if (!success) {
        //     return sendError(400, message)
        // }
        //
        // bookingInformation.bookedRooms = bookedRooms;
        // bookingInformation.totalPrice = totalPrice *= numberOfNights;
        // 

        // <----- delete
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
        }

        bookingInformation.bookedRooms = bookedRooms;
        bookingInformation.totalPrice = totalPrice *= numberOfNights;
        // ---->
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
