const { sendResponse, sendError } = require("../../responses/index.js");
const { db } = require("../../services/index.js");

exports.handler = async (event) => {
  return sendResponse(200, { message: "GetAllRooms" });
};
