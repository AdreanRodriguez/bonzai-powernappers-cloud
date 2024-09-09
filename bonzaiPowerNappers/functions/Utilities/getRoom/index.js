
const { sendResponse, sendError } = require("../../responses/index.js");
const { db } = require("../../services/index.js");


async function getRoom (roomType){
 try{
   
    const {Items} = await db.scan ({

        tableName: 'bonzai-rooms-db',
        FilterExpressions: "#roomType = :roomType AND #isBooked = isBookedFalse",
        
        ExpressionAttributeNames:{
            "#roomType": "roomType",
            "#isBooked":"isBooked",
        },

        ExpressionAttributeValues:{
          ":roomType": roomType,
          ":isBookedFalse":false
            
        }

    })

    if(Items){
        
        return sendResponse(200,Items)
    
    }else{

        return sendError(404, {success:false, message: 'No such of room dont exists'})
    }

 }catch(error){

        return sendError(404, {message: error.message})
 }
 
}