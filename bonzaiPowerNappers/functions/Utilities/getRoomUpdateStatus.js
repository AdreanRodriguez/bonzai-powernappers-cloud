const { getRoom } = require("./getRoom.js")
const { updateRoomStatus } = require("./updateRoomStatus.js")

async function getRoomUpdateStatus(roomTypes) {
    const bookedRooms = [];
    let totalPrice = 0;

    for (let type of roomTypes) {
        const roomResponse = await getRoom(type);
        if (!roomResponse.success) {
            return { success: false, message: roomResponse.message };
        }
        const room = roomResponse.item;
        const updateResponse = await updateRoomStatus(room, true);
        if (!updateResponse.success) {
            return {
                success: false,
                message: updateResponse.message
            };
        }
        delete room.isBooked;
        bookedRooms.push(room);
        totalPrice += room.price;
    }
    return {
        success: true,
        bookedRooms,
        totalPrice
    }
}

module.exports = { getRoomUpdateStatus }