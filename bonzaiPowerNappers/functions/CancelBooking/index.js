const { sendResponse, sendError } = require("../../responses/index.js");
const { getOrder } = require("../Utilities/getOrder.js");
const { deleteBookingInDb } = require("../Utilities/deleteBookingInDb.js");
const { updateRoomStatus } = require("../Utilities/updateRoomStatus.js");

exports.handler = async (event) => {
    const { id } = event.pathParameters;
    const response = await getOrder(id);
    if (response.success) {
        for (let i = 0; i < (response.items.length); i++) {
            const deleteResponse = await deleteBookingInDb(response.items[i]);
            if (!deleteResponse.success) {
                return sendError(404, deleteResponse.message);
            }
            const updateResponse = await updateRoomStatus(response.items[i].bookedRoom, false);
            if (!updateResponse.success) {
                return sendError(404, updateResponse.message);
            }
        }
        return sendResponse(200, "Booking successfully deleted");
    } else {
        return sendError(404, response.message);
    }
};
