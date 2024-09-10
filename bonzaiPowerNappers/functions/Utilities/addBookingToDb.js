const { db } = require("../../services");

async function addBookingToDb(bookingInformation, room) {

    if (bookingInformation && room) {

        try {
            await db.put({
                TableName: 'bonzai-booking-db',
                Item: {
                    bookingId: bookingInformation.bookingId + room.roomId,
                    orderId: bookingInformation.bookingId,
                    checkIn: JSON.stringify(bookingInformation.checkIn),
                    checkOut: JSON.stringify(bookingInformation.checkOut),
                    guestName: bookingInformation.guestName,
                    guestEmail: bookingInformation.guestEmail,
                    totalPrice: bookingInformation.totalPrice,
                    bookedRoom: room


                }


            })
           return{
            success: true,
            message: 'Booking added successfully'
           }

        } catch (error) {

            return {
                success: false,
                message: error.message
            }
        }
    } else {
        return {
            success: false,
            message : 'Can not add booking , please try again'
        }
    }
}

module.exports = { addBookingToDb }