const { deleteBookingInDb } = require("./deleteBookingInDb");
const { updateRoomStatus } = require("./updateRoomStatus");

async function deleteAndUpdateStatus(orderResponse) {

    for (let order of orderResponse) {
        const deleteResponse = await deleteBookingInDb(order);
        if (!deleteResponse.success) {
            return { success: false, message: deleteResponse.message };
        }
        const updateResponse = await updateRoomStatus(order.bookedRoom, false);
        if (!updateResponse.success) {
            return { success: false, message: updateResponse.message };
        }
    }
    return { success: true }
}

module.exports = { deleteAndUpdateStatus };
