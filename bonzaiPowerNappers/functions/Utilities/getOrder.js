const { db } = require("../../services/index.js");

async function getOrder(id) {
    try {
        const { Items } = await db.scan({
            TableName: "bonzai-booking-db",
            FilterExpression: "begins_with(#bookingId, :id )", //Eftersom bookingID består av orderId + roomId måste det sökas på första delen av bookingId
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