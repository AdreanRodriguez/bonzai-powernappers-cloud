const { db } = require("../../services/index.js");

async function getRooms(roomType) {
    try {
        // söker efter alla rum som INTE är bokade med den typ av rum som är i roomType
        // söker efter alla rum som INTE är bokade med den typ av rum som är i roomType
        const { Items } = await db.scan({
            TableName: 'bonzai-rooms-db',
            FilterExpression: "#roomType = :roomType AND #isBooked = :isBookedFalse",
            ExpressionAttributeNames: {
                "#roomType": "roomType",
                "#isBooked": "isBooked",
            },
            ExpressionAttributeValues: {
                ":roomType": roomType,
                ":isBookedFalse": false
            }
        })
        if (Items.length < 1) {
            return { success: false, message: 'No rooms available' }
        }
        return {
            success: true,
            items: Items
        }
    } catch (error) {
        return { success: false, message: error.message }
        return { success: false, message: error.message }
    }
}

module.exports = { getRooms }