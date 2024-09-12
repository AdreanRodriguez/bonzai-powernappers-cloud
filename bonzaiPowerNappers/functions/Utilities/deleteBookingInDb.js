const { db } = require("../../services/index.js");

async function deleteBookingInDb(item) {
    try {
        await db.delete({
            TableName: "bonzai-booking-db",
            Key: {
                bookingId: item.bookingId
            }
        });
        return { success: true }
    } catch (error) {
        return {
            success: false,
            message: `Failed to delete booking ${item.bookingId}: ${error.message} !`
        }
    }
}

module.exports = { deleteBookingInDb };