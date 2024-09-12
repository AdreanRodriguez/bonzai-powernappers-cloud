const { deleteBookingInDb } = require("./deleteBookingInDb");
const { updateRoomStatus } = require("./updateRoomStatus");
// Funktionalitet för CancelBooking och ChangeBooking
async function deleteAndUpdateStatus(orderResponse) {

    for (let order of orderResponse) {
        const deleteResponse = await deleteBookingInDb(order);
        if (!deleteResponse.success) {
            return { success: false, message: deleteResponse.message };
        } // rumsinfo finns i order.bookedRoom som är ett objekt med all information om rummet.
        const updateResponse = await updateRoomStatus(order.bookedRoom, false);
        if (!updateResponse.success) {
            return { success: false, message: updateResponse.message };
        }
    }
    return { success: true }
}

module.exports = { deleteAndUpdateStatus };
