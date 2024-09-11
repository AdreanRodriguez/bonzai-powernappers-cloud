const { sendResponse, sendError } = require("../../responses/index.js");
const { getOrder } = require("../Utilities/getOrder.js");
const { addBookingToDb } = require("../Utilities/addBookingToDb.js");
const { compareNmbrOfPeople } = require("../Utilities/compareNmbrOfPeople.js");
const { getRoomUpdateStatus } = require("../Utilities/getRoomUpdateStatus.js");
const { deleteAndUpdateStatus } = require("../Utilities/deleteAndUpdateStatus.js");

exports.handler = async (event) => {
    try {
        const { id } = event.pathParameters;
        // Input från body 
        const { nmbrOfGuests, roomTypes, checkIn, checkOut } = JSON.parse(event.body);
        // Kontroll att all nödvändig info skickats in
        if (!nmbrOfGuests || !roomTypes || !checkIn || !checkOut) {
            return sendError(
                404,
                "Missing required fields: checkIn, checkOut, roomTypes or nmbrOfGuests."
            );
        }
        // Kontroll att antal gäster stämmer med antal rumstyp
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
        // Anropa deleteAndUpdateStatus för att radera varje dokument i db med detta ordernr 
        // samt uppdatera rummens status isBooked: false
        const deleteUpdateResponse = await deleteAndUpdateStatus(orderResponse.items)
        if (!deleteUpdateResponse.success) {
            return sendError(404, deleteUpdateResponse.message)
        }
        // Tar emot arrayen roomTypes för att hämta alla rum som ska bokas och uppdaterar status isBooked: true på dem i db
        // samt skapar totalpris per natt och bokning (alla rum)
        const { success, bookedRooms, totalPrice, message } = await getRoomUpdateStatus(roomTypes)
        if (!success) {
            return sendError(404, message)
        }

        bookingInformation.bookedRooms = bookedRooms;
        bookingInformation.totalPrice = totalPrice * numberOfNights;
        // För varje bokat rum som vi gör (room) så lägger vi in room i vår db tillsammans med vår bokningsinformation
        for (let room of bookedRooms) {
            const bookingResponse = await addBookingToDb(bookingInformation, room);
            if (!bookingResponse.success) {
                return sendError(404, bookingResponse.message);
            }
        }
        return sendResponse(200, bookingInformation);
    } catch (error) {
        return sendError(404, error.message);
    }
};
