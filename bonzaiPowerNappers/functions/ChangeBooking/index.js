const { sendResponse, sendError } = require("../../responses/index.js");
const { getOrder } = require("../Utilities/getOrder.js");
const { compareNmbrOfPeople } = require("../Utilities/compareNmbrOfPeople.js");
const { deleteAndUpdateStatus } = require("../Utilities/deleteAndUpdateStatus.js");
const { addAndUpdateStatus } = require("../Utilities/addandUpdateStatus.js");
const { compareChanges } = require("../Utilities/compareChanges.js");
const { getRoomsToBook } = require("../Utilities/getRoomsToBook.js");

exports.handler = async (event) => {
    try {
        const { id } = event.pathParameters;
        const { nmbrOfGuests, roomTypes, checkIn, checkOut } = JSON.parse(event.body);

        if (!nmbrOfGuests || !roomTypes || !checkIn || !checkOut) {
            return sendError(404, "Missing required fields: checkIn, checkOut, roomTypes or nmbrOfGuests.");
        }
        // Kontroll att antal gäster stämmer med antal rumstyp
        if (!compareNmbrOfPeople(nmbrOfGuests, roomTypes)) {
            return sendError(
                404,
                "Wrong amount of people booked."
            );
        }
        // hämtar alla ordrar som tillhör bookingId
        const orderResponse = await getOrder(id);
        if (!orderResponse.success) {
            return sendError(404, orderResponse.message);
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const numberOfNights = Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (numberOfNights < 1) {
            return sendError(404, "Please check dates!");
        }
        const bookingInformation = {
            checkIn: checkInDate.toLocaleDateString("se-SV"),
            checkOut: checkOutDate.toLocaleDateString("se-SV"),
            bookingId: id,
            roomTypes,
            nmbrOfGuests,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            orderId: orderResponse.items[0].orderId,
            guestEmail: orderResponse.items[0].guestEmail,
            guestName: orderResponse.items[0].guestName,
        };
        // compareChanges är en function som kontrollerar hur tidigare ordrar ska hanteras 
        // oldOrders är ordrar som inte matchar roomTypes och ska tas bort
        // roomsToSave är ordrar som matchar roomTypes och ska sparas
        // roomTypesToAdd är de extra typerna som måste bokas  
        const { oldOrders, roomsToSave, roomTypesToAdd, savedTotalPrice } = compareChanges(orderResponse.items, roomTypes);

        // tar bort bokningar från databasen och updaterar isBooked för rum
        const deleteResponse = await deleteAndUpdateStatus(oldOrders);
        if (!deleteResponse.success) {
            return sendError(404, deleteResponse.message);
        }

        // getRoomsToBook är en funktion som hämtar alla de rum som användaren vill boka och lägger dem i en array
        const { success, bookedRooms, totalPrice, message } = await getRoomsToBook(roomTypesToAdd);
        if (!success) {
            return sendError(404, message);
        }

        // lägger till bokade rum i databasen och updaterar isBooked-status på rum.
        const response = await addAndUpdateStatus(bookedRooms, bookingInformation);
        if (!response.success) {
            return sendError(404, response.message);
        }

        // Lägger till de rum som redan fanns i bokningsdatabasen och som tillhör ordern.
        roomsToSave.forEach(room => {
            bookedRooms.push(room);
        });

        bookingInformation.bookedRooms = bookedRooms;
        bookingInformation.totalPrice = (totalPrice + savedTotalPrice) * numberOfNights;

        return sendResponse(200, bookingInformation);
    } catch (error) {
        return sendError(404, error.message);
    }
};