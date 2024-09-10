async function updateRoomStatus(room, bool) {
  try {
    await db.update({
      TableName: "bonzai-rooms-db",
      Key: {
        roomId: room.roomId,
      },
      ReturnValues: "ALL_NEW",
      UpdateExpression: "set isBooked = :isBooked",
      ExpressionAttributeValues: {
        ":isBooked": bool,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = { updateRoomStatus };
