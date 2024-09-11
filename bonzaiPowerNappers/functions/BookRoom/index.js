const { v4: uuid } = require("uuid");
const { addBookingToDb } = require("../Utilities/addBookingToDb.js");
const { sendResponse, sendError } = require("../../responses/index.js");
const { compareNmbrOfPeople } = require("../Utilities/compareNmbrOfPeople.js");
const { getRoomUpdateStatus } = require("../Utilities/getRoomUpdateStatus.js");

exports.handler = async (event) => {
    try {

        // Input från body 
        const { checkIn, checkOut, roomTypes, guestName, guestEmail, nmbrOfGuests } = JSON.parse(
            event.body
        );
        // Kontroll att all nödvändig info skickats in

        if (!checkIn || !checkOut || !roomTypes || !guestName || !guestEmail || !nmbrOfGuests) {
            return sendError(
                400,
                "Missing required fields: checkIn, checkOut, roomTypes, guestName, guestEmail, and number of guests.");
        }
        // Kontroll att antal gäster stämmer med antal sängar
        if (!compareNmbrOfPeople(nmbrOfGuests, roomTypes)) {
            return sendError(404, "Wrong amount of people booked"); s
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);                                         //millisec sec min timmar = 1 dygn
        const numberOfNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        const bookingId = uuid().substring(0, 8);
        const bookingInformation = {
            checkIn: checkInDate.toLocaleDateString("se-SV"),
            checkOut: checkOutDate.toLocaleDateString("se-SV"),
            bookingId,
            roomTypes,
            guestName,
            guestEmail,
            nmbrOfGuests,
        };
        // Lägger önskade rum i en array, samt uppdaterar rumsstatus och totalpris. Returnerar array och totalpris
        const { success, bookedRooms, totalPrice, message } = await getRoomUpdateStatus(roomTypes)
        if (!success) {
            return sendError(400, message)
        }
        // Lägger till bokade rum och totalpris i bookingInformation, som sedan blir bokningsbekräftelse i return.
        bookingInformation.bookedRooms = bookedRooms;
        bookingInformation.totalPrice = totalPrice *= numberOfNights;

        for (let room of bookedRooms) {
            const response = await addBookingToDb(bookingInformation, room);
            if (!response.success) {
                return sendError(404, response.message);
            }
        }
        return sendResponse(200, bookingInformation);

    } catch (error) {
        return sendError(404, error.message);
    }
};
