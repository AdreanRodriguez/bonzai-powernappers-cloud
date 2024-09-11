const { sendResponse, sendError } = require("../../responses/index.js");
const { db } = require("../../services/index.js");

exports.handler = async (event) => {
    try {
        const { Items } = await db.scan({
            TableName: "bonzai-booking-db",
            FilterExpression: "attribute_exists(#DYNOBASE_bookingId)",
            ExpressionAttributeNames: { "#DYNOBASE_bookingId": "bookingId" },
        });
        if (Items.length < 1) {
            return sendError(404, "No bookings found");
        } else {
            return sendResponse(200, Items);
        }
    } catch (error) {
        return sendError(404, error.message);
    }
};
