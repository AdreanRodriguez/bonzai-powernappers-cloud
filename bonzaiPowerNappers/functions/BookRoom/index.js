const { v4: uuid } = require("uuid");
const { sendResponse, sendError } = require("../../responses/index.js");
const { compareNmbrOfPeople } = require("../Utilities/compareNmbrOfPeople.js");
const { getRoomsToBook } = require("../Utilities/getRoomsToBook.js");
const { addAndUpdateStatus } = require("../Utilities/addandUpdateStatus.js");

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
            return sendError(404, "Wrong amount of people booked");
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);                                         //millisec sec min timmar = 1 dygn
        const numberOfNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        if (numberOfNights < 1) {
            return sendError(404, "Please check dates!");
        }
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
        // getRoomsToBook är en funktion som hämtar alla de rum som användaren vill boka
        const { success, bookedRooms, totalPrice, message } = await getRoomsToBook(roomTypes)
        if (!success) {
            return sendError(400, message)
        }
        // addAndUpdateStatus är en funktion som uppdatera bokningsdatabasen med nya bokningar samt uppdatera rumsdatabasen med isBooked: true för varje bokat rum
        const response = await addAndUpdateStatus(bookedRooms, bookingInformation);
        if (!response.success) {
            return sendError(400, response.message)
        }
        // Lägger till bokade rum och totalpris i bookingInformation, som sedan blir bokningsbekräftelse i return.
        bookingInformation.bookedRooms = bookedRooms;
        bookingInformation.totalPrice = totalPrice * numberOfNights;

        return sendResponse(200, bookingInformation);

    } catch (error) {
        return sendError(404, error.message);
    };
}
