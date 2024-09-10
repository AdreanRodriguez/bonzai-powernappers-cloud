const { sendResponse, sendError } = require("../../responses/index.js");
const { db } = require("../../services/index.js");

exports.handler = async (event) => {
   try{
    
    const { Items } = await db.scan({
      TableName:'bonzai-booking-db',
      FilterExpressions: "begins_with(#bookingid,:id)",
      ExpressionAttributeNames: {"#bookingid":"bookingid"},
      ExpressionAttriubeValues:{".id":orderID},

    })
    
    return sendResponse(200, { message: Items });

   } catch(error){

    return sendError(404, {message: error.message})
   }
  
 
};
