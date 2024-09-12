const { db } = require("../../services");

// Lägger till rum i databasen
async function addRoomToDb(roomType, floorNmbr, roomNmbr) {
    let roomId = "";
    let price = 0;
    let beds = 0;
    let isBooked = false;

    switch (roomType.toLowerCase()) {
        case "single":
            roomId = `SR${floorNmbr}${roomNmbr}`;
            price = 500;
            beds = 1;
            break;
        case "double":
            roomId = `DR${floorNmbr}${roomNmbr}`;
            price = 1000;
            beds = 2;
            break;
        case "suite":
            roomId = `SU${floorNmbr}${roomNmbr}`;
            price = 1500;
            beds = 3;
            break;
        default:
            return { success: false, message: "No Rooms with that type" }
    }

    try {
        await db.put({
            TableName: "bonzai-rooms-db",
            Item: {
                roomType,
                roomId,
                price,
                beds,
                floorNmbr,
                roomNmbr,
                isBooked
            },
        });

        return { success: true }
    } catch (error) {
        return { success: false, message: error.message }
    }
}

module.exports = { addRoomToDb }