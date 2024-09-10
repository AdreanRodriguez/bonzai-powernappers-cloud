const { sendError, sendResponse } = require("../../responses/index.js");
const { db } = require("../../services/index.js");

async function deleteBookingInDb( item ) {
    const params = {
        TableName: "bonzai-booking-db",
        Key: {
            bookingId: item.bookingId
        }
    };

    try {
        await db.delete(params);
        return sendResponse(200, `Booking ${item.bookingId} was successfully deleted.`);
    } catch (error) {
        console.error("Error deleting booking", error.message);
        return sendError(500, `Failed to delete booking ${item.bookingId}: ${error.message} !`);
    }
}

module.exports = { deleteBookingInDb };