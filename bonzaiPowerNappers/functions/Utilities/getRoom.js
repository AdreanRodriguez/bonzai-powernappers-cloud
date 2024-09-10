const { db } = require("../../services/index.js");

async function getRoom(roomType) {
  try {
    const { Items } = await db.scan({
      TableName: "bonzai-rooms-db",
      FilterExpression: "#roomType = :roomType AND #isBooked = :isBookedFalse",

      ExpressionAttributeNames: {
        "#roomType": "roomType",
        "#isBooked": "isBooked",
      },

      ExpressionAttributeValues: {
        ":roomType": roomType,
        ":isBookedFalse": false,
      },
    });

    if (Items) {
      return {
        success: true,
        item: Items[0],
      };
    } else {
      return { success: false, message: "No empty rooms" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = { getRoom };
