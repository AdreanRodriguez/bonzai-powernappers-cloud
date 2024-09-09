const { sendResponse, sendError } = require("../../responses/index.js");
const { db } = require("../../services/index.js");

exports.handler = async (event) => {
  try {
    const { Items } = await db.scan({
      TableName: "bonzai-rooms-db",
      FilterExpression: "attribute_exists(#DYNOBASE_rooms)",
      ExpressionAttributeNames: { "#DYNOBASE_rooms": "roomType" },
    });

    if (Items.length < 1) {
      return sendError(404, "No rooms found");
    } else {
      return sendResponse(200, Items);
    }
  } catch (error) {
    return sendError(404, { message: error.message });
  }
};
