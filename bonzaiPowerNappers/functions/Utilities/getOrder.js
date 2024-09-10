const { db } = require("../../services/index.js");

async function getOrder(id) {
    try {
        const { Items } = await db.scan({
            TableName: "bonzai-booking-db",
            FilterExpression: "begins_with(#bookingId, :id )",
            ExpressionAttributeNames: { "#bookingId": "bookingId" },
            ExpressionAttributeValues: { ":id": id },
        });

        if (Items.length < 1) {
            return {
                success: false,
                message: "No orders found",
            };
        } else {
            return {
                success: true,
                items: Items,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

module.exports = { getOrder }