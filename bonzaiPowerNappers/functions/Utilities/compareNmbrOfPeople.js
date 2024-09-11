function compareNmbrOfPeople(nmbrOfGuests, types) {
    let nmbrOfbookedGuests = 0

    for (let i = 0; i < types.length; i++) {
        switch (types[i].toLowerCase()) {
            case "single":
                nmbrOfbookedGuests += 1
                break;
            case "double":
                nmbrOfbookedGuests += 2
                break;
            case "suite":
                nmbrOfbookedGuests += 3
                break;
            default:
        }
    }

    if (nmbrOfbookedGuests === nmbrOfGuests) {
        return true
    } else {
        return false
    }
}

module.exports = { compareNmbrOfPeople }