const { deleteBookingInDb } = require("./deleteBookingInDb");
const { updateRoomStatus } = require("./updateRoomStatus");

async function deleteAndUpdateStatus(orderResponse) {
    for (let i = 0; i < orderResponse.length; i++) {
        const deleteResponse = await deleteBookingInDb(orderResponse[i]);
        if (!deleteResponse.success) {
            return { success: false, message: deleteResponse.message };
        }
        const updateResponse = await updateRoomStatus(orderResponse[i].bookedRoom, false);
        if (!updateResponse.success) {
            return { success: false, message: updateResponse.message };
        }
    }
    return { success: true }
}

module.exports = { deleteAndUpdateStatus };
