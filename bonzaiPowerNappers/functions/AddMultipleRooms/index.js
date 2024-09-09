const { db } = require("../../services/index.js");
const { sendError, sendResponse } = require("../../responses");

// Lägga till rum i databasen
async function addRoomsToDb(roomType, roomId, price, isBooked, beds, floorNmbr, roomNmbr) {
    const params = {
        TableName: "bonzai-rooms-db",
        Item: {
            roomType,
            roomId,
            price,
            isBooked,
            beds,
            floorNmbr,
            roomNmbr
        }
    };

    try {
        await db.put(params);
        return true;
    } catch (error) {
        return { false: error.message };
    }
}

// generera roomId baserat på roomType och roomNmbr
function generateRoomId(roomType, roomNmbr) {
    if (roomType === "suite") {
        return `SU${roomNmbr}`;
    }
    return `${roomType.charAt(0).toUpperCase()}R${roomNmbr}`;
}

// hämta standardpris och antal sängar för rumsstyp
function getDefaultPriceAndBeds(roomType) {
    switch (roomType) {
        case "single":
            return { price: 500, beds: 1 };
        case "double":
            return { price: 1000, beds: 2 };
        case "suite":
            return { price: 1500, beds: 3 };
        default:
            return { price: 0, beds: 0 }; // För att undvika fel om något går fel
    }
}

// Handler
exports.handler = async (event) => {
    const rooms = JSON.parse(event.body);

    for (let room of rooms) {
        // Kontrollera att alla nödvändiga fält finns
        if (!room.roomType || !room.floorNmbr || !room.roomNmbr || room.isBooked === undefined) {
            return sendError(400, "Please check room details.");
        }

        // Kontrollera att roomType är giltig
        const validateRoomTypes = ["single", "double", "suite"];
        if (!validateRoomTypes.includes(room.roomType)) {
            return sendError(400, `Invalid room type: ${room.roomType}. Must be single, double, or suite.`);
        }

        // Tilldela standardpris och antal sängar om de inte finns
        const { price, beds } = getDefaultPriceAndBeds(room.roomType);
        const roomPrice = room.price || price;
        const roomBeds = room.beds || beds;

        // Generera roomId baserat på rumsnumret och roomType
        const roomId = generateRoomId(room.roomType, room.roomNmbr);

        // Lägg till rummet i databasen
        const result = await addRoomsToDb(
            room.roomType,
            roomId,
            roomPrice,
            room.isBooked,
            roomBeds,
            room.floorNmbr,
            room.roomNmbr
        );
        if (result !== true) {
            return sendError(500, result.false);
        }
    }

    // Om alla rum lagts till korrekt
    return sendResponse(200, "All rooms added successfully.");
};