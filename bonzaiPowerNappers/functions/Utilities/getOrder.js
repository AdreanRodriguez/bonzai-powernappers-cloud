const { sendResponse, sendError } = require("../../responses/index.js");
const { db } = require("../../services/index.js");

exports.getOrder = async (id) => {
  try {
    const { Items } = await db.scan({
      TableName: "bonzai-booking-db",
      FilterExpression: "begins_with(#bookingId, :id )",
      ExpressionAttributeNames: { "#bookingId": "bookingId" },
      ExpressionAttributeValues: { ":id": id },
    });

    if (Items.length < 1) {
      return sendError(404, "No orders found");
    } else {
      return sendResponse(200, Items);
    }
  } catch (error) {
    return sendError(404, { message: error.message });
  }
};
