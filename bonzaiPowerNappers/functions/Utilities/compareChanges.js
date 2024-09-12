function compareChanges(orders, newRoomTypes) {
    const oldOrders = orders;
    const roomsToSave = [];
    const roomTypesToAdd = [];
    let savedTotalPrice = 0

    for (let type of newRoomTypes) {
        let foundRoom = false
        for (let i = 0; i < oldOrders.length; i++) {
            if (!foundRoom) {
                if (oldOrders[i].bookedRoom.roomType === type) {
                    const roomToSave = oldOrders.splice(i, 1)
                    savedTotalPrice += roomToSave[0].bookedRoom.price
                    roomsToSave.push(roomToSave[0])
                    foundRoom = true;
                }
            }
        }
        if (!foundRoom) {
            roomTypesToAdd.push(type)
        }
    }

    return { oldOrders, roomsToSave, roomTypesToAdd, savedTotalPrice }
}

module.exports = { compareChanges }