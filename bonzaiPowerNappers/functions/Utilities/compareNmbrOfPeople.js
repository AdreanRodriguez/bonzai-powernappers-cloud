function compareNmbrOfPeople(nmbrOfGuests, roomTypes) {
    let nmbrOfbookedGuests = 0

    for (let type of roomTypes) {
        switch (type.toLowerCase()) {
            case "single":
                nmbrOfbookedGuests += 1
                break;
            case "double":
                nmbrOfbookedGuests += 2
                break;
            case "suite":
                nmbrOfbookedGuests += 3
                break;
        }
    }

    if (nmbrOfbookedGuests === nmbrOfGuests) {
        return true
    } else {
        return false
    }
}

module.exports = { compareNmbrOfPeople }