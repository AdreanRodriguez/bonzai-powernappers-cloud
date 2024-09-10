const { db } = require("../../services");

async function addBookingToDb(bookingInformation, room) {

    if (bookingInformation && room) {

        try {
            await db.put({
                TableName: 'bonzai-booking-db',
                Item: {
                    bookingId: bookingInformation.bookingId + room.roomId,
                    orderId: bookingInformation.bookingId,
                    checkIn: bookingInformation.checkIn,
                    checkOut: bookingInformation.checkOut,
                    guestName: bookingInformation.guestName,
                    guestEmail: bookingInformation.guestEmail,
                    totalPrice: bookingInformation.totalPrice,
                    bookedRoom: room


                }


            })


        } catch (error) {

            return {
                success: false,
                message: error.message
            }
        }
    } else {
        return {
            success: true
        }
    }
}

module.exports = { addBookingToDb }