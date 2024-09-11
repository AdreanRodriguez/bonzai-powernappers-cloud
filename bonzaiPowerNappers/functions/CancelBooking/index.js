const { sendResponse, sendError } = require("../../responses/index.js");
const { getOrder } = require("../Utilities/getOrder.js");
const { deleteAndUpdateStatus } = require("../Utilities/deleteAndUpdateStatus.js")

exports.handler = async (event) => {
    const { id } = event.pathParameters;
    const response = await getOrder(id);
    if (response.success) {
        const deleteUpdateResponse = await deleteAndUpdateStatus(response.items)
        if (!deleteUpdateResponse.success) {
            return sendError(400, deleteUpdateResponse.message)
        }
        return sendResponse(200, "Booking successfully deleted");
    } else {
        return sendError(404, response.message);
    }
};
