// File Dependencies
const jeeves = require('./functions.js');
const stockTool = require('../stocks.js');

function sendGenericMessage(recipientID, messageText) {
    console.log("A generic message was requested.");
    return false;
}

function sendTextMessage(recipientID, messageText) {
    const messageData = {
        recipient: {
            id: recipientID
        },
        message: {
            text: messageText
        }
    };
    
    jeeves.callSendAPI(messageData);
}

function sendIndexData(senderID) {
    stockTool.getIndices((error, response, body) => {
        if (!error && response.statusCode === 200) {
            console.log('It\'s alive!');
            
            // Format response body into a human-readable format.
            // Send formatted data back to the user.
            sendTextMessage(senderID, jeeves.formatStockData(body));
        }
        else {
            console.error('An error occured. ', 
            response.statusCode, response.statusMessage);
        }
    });
}

module.exports = {
    sendGenericMessage,
    sendTextMessage,
    sendIndexData
};