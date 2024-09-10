const { sendError, sendResponse } = require("../../responses/index.js");
const { addRoomToDb } = require("../Utilities/addRoomToDb.js");

// Handler
exports.handler = async (event) => {
    try {
        // Kontrollera om event.body existerar och innehåller en array
        if (!event.body) {
            return sendError(400, "Request body is missing.");
        }

        const rooms = JSON.parse(event.body);

        // Kontrollera om det är en array
        if (!Array.isArray(rooms)) {
            return sendError(400, "Body must be an array of rooms.");
        }

        // Loop igenom varje rum i arrayen
        for (let room of rooms) {
            // Kontrollera att alla nödvändiga fält finns
            if (!room.roomType || !room.floorNmbr || !room.roomNmbr) {
                return sendError(400, "Please check room details. 'roomType', 'floorNmbr', and 'roomNmbr' are required.");
            }

            // Kontrollera att roomType är giltig
            const validateRoomTypes = ["single", "double", "suite"];
            if (!validateRoomTypes.includes(room.roomType)) {
                return sendError(400, `Invalid room type: ${room.roomType}. Must be single, double, or suite.`);
            }

            // Anropa funktionen för att lägga till rummet i databasen
            const result = await addRoomToDb(room.roomType, room.floorNmbr, room.roomNmbr);

            // Kontrollera resultatet från addRoomToDb
            if (!result.success) {
                return sendError(500, result.message || "Failed to add room.");
            }
        }

        // Kolla om rum lagts till korrekt
        return sendResponse(200, "All rooms added successfully.");
    } catch (error) {
        console.error("Handler error:", error.message);
        return sendError(500, "Internal server error.");
    }
};
