const { sendError, sendResponse } = require("../../responses/index.js");
const { db } = require("../../services/index.js");

async function deleteBookingInDb(bookingId) {
    const params = {
        TableName: "bonzai-booking-db",
        Key: {
            bookingId: bookingId
        }
    };

    try {
        await db.delete(params);
        return sendResponse(200, `Booking ${bookingId} was successfully deleted.`);
    } catch (error) {
        console.error("Error deleting booking", error.message);
        return sendError(500, `Failed to delete booking ${bookingId}: ${error.message} !`);
    }
}

module.exports = { deleteBookingInDb };