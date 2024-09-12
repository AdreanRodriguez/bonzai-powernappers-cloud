const { addBookingToDb } = require("./addBookingToDb");
const { updateRoomStatus } = require("./updateRoomStatus");
// För varje rum i bookedRooms uppdateras bokningsdatabasen med nya dokument samt uppdateras rumsdatabasen med isBooked: true för varje bokat rum
async function addAndUpdateStatus(bookedRooms, bookingInformation) {
    for (let room of bookedRooms) {
        const response = await addBookingToDb(bookingInformation, room);
        if (!response.success) {
            return { success: false, message: response.message };
        }
        const roomResponse = await updateRoomStatus(room, true)
        if (!roomResponse) {
            return { success: false, message: roomResponse.message };
        }
    }
    return { success: true }
}

module.exports = { addAndUpdateStatus } 