const { getRooms } = require("./getRooms.js")

async function getRoomsToBook(roomTypes) {
    let totalPrice = 0; // totalpriset för alla rum vi vill boka 
    const availableRooms = []; // här kommer alla lediga rum av önskad typ som hämtas från getRooms sparas
    const bookedRooms = []; // här kommer alla rum vi vill boka sparas 
    const roomTypesSorted = roomTypes.sort()
    let latestRoomTypeAdded = "" // Här kommer den senaste rumstypen sparas som hämtades från getRooms

    for (let type of roomTypesSorted) {
        if (latestRoomTypeAdded !== type && availableRooms.length < 1 || availableRooms.length > 0 && availableRooms[0].roomType !== type) {
            const { success, items, message } = await getRooms(type)
            if (!success) {
                return {
                    success: false,
                    message: message
                }
            }
            availableRooms.splice(0, availableRooms.length) // tömmer availableRooms innan nya läggs till 
            items.forEach(item => {
                availableRooms.push(item)
            });
            latestRoomTypeAdded = type;
        }

        if (availableRooms.length > 0) {
            const roomToAdd = availableRooms.splice(0, 1) //Flyttar första lediga rummet av önskad type från availableRooms till roomToAdd
            delete roomToAdd[0].isBooked
            totalPrice += roomToAdd[0].price;
            bookedRooms.push(roomToAdd[0]);
        }


        // kontollerar så att det inte finns två rum med samma roomId
        // const foundItem = bookedRooms.some((item) => item.roomId === roomToAdd[0].roomId)
        // if (foundItem) {
        //     return {
        //         success: false,
        //         message: "not enough empty rooms"
        //     }
        // }


    }

    if (roomTypes.length !== bookedRooms.length) { //roomTypes är de rum användaren vill lägga till.
        return {
            success: false,
            message: "No rooms available"
        }
    }

    return { success: true, bookedRooms, totalPrice }
}

module.exports = { getRoomsToBook }