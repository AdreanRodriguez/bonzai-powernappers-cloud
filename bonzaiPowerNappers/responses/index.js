exports.sendResponse = async (status, data) => {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ success: true, data }),
  };
};

exports.sendError = async (status, data) => {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ success: false, data }),
  };
};
