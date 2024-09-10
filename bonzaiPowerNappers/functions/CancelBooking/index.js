const { sendResponse, sendError } = require("../../responses/index.js");
const { db } = require("../../services/index.js");
const { getOrder } = require("../Utilities/getOrder.js");
const { deleteBookingInDb } = require("../Utilities/deleteBookingInDb.js");

exports.handler = async (event) => {
  const { id } = event.pathParameters;
  const response = await getOrder(id);
  if (response.success) {
    for (let i = 0; i < getOrder.length; i++) {
      const deleteResponse = await deleteBookingInDb(response.items[i]);
      if (!deleteResponse.success) {
        return sendError(404, deleteResponse.message);
      }
      const updateResponse = await uppdateRoomStatus(response.items[i], false);
      if (!updateResponse.success) {
        return sendError(404, updateResponse.message);
      }
    }
    return sendResponse(200, "Booking successfully deleted");
  } else {
    return sendError(404, response.message);
  }
};
