const { sendResponse, sendError } = require("../../responses/index.js");
const { db } = require("../../services/index.js");
const { getOrder } = require("../Utilities/getOrder.js");
const { deleteBookingInDb } = require("../Utilities/deleteBookingInDb.js");

exports.handler = async (event) => {
  const { id } = event.pathParameters;
  const response = await getOrder(id);
  if (!response.success) {
    return sendError(404, response.message);
  } else {
    for (let i = 0; i < deleteBookingInDb.length; i++) {}
  }
};
