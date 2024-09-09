const { sendResponse, sendError } = require("../../responses/index.js");
const { db } = require("../../services/index.js");
const { v4: uuid } = require('uuid');

exports.handler = async (event) => {
  const { nmbrofGuests, bookedRooms, guestName, guestEmail } = JSON.parse(event.body);

  const bookingId = uuid().substring(0, 5);
   
  if(parseInt(nmbrofGuests>10)){
    sendError(400,"Det är tyvärr fullbokat, max antal gäster är 10 st")
   }
  // Check that all required fields are provided
  if (nmbrofGuests && bookedRooms && guestName && guestEmail) {
  
    
    try {
      await db.put({
        TableName: 'bonzai-booking-db',
        Item: {
          bookingId: bookingId,
          nmbrofGuests: nmbrofGuests,
          guestName: guestName,
          guestEmail: guestEmail,
        }
      });

      return sendResponse(200, { bookingId });

    } catch (error) {
      // Return the actual error for debugging
      return sendError(500, error.message);
    }
  } else {
    // Return a useful error message if any fields are missing
    return sendError(400, "Missing required fields");
  }
};
