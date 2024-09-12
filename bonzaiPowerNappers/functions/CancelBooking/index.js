const { sendResponse, sendError } = require("../../responses/index.js");
const { getOrder } = require("../Utilities/getOrder.js");
const { deleteAndUpdateStatus } = require("../Utilities/deleteAndUpdateStatus.js")

exports.handler = async (event) => {
    const { id } = event.pathParameters;
    // Vi sparar returen från getOrder i en variabel
    // Den hämtar alla ordrar med id som skrivs in 
    const orderResponse = await getOrder(id);
    if (!orderResponse.success) {
        return sendError(404, orderResponse.message);
    }
    const deleteUpdateResponse = await deleteAndUpdateStatus(orderResponse.items)
    if (!deleteUpdateResponse.success) {
        return sendError(404, deleteUpdateResponse.message)
    }
    return sendResponse(200, "Booking successfully deleted");
};