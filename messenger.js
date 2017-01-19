/* 
 *  Messenger.js is a module that defines all messenger-related functions of the
 *  chat bot.
 */

const request = require('request');

// receivedMessage routes any message callbacks from the Webhook.
function receivedMessage(event) {
    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfMessage = event.timestamp;
    const message = event.message;
    
    console.log('Received message from user %d for page %d at %d',
        senderID, recipientID, timeOfMessage);
        
    const messageId = message.mid;
    console.log('Received Message ID: %s', messageId);
    
    const messageText = message.text;
    const messageAttachments = message.attachment;
    
    if (messageText) {
        switch (messageText) {
            case "generic":
                sendGenericMessage(senderID);
                break;
            
            default:
                sendTextMessage(senderID, messageText);
                break;
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received!");
    }
}

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
    
    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: "EAAZAhsDpOKPYBADY1DHVqlfzOc5HuwbDXQXS1gszoCQewT5Q9aJjhvePNfUED60oAtZBDl7g10pbEgdJAh4OYiGn84We4ehy7YPs0ngZBDD0oyi0lph5ZAMeYCMQxfB6HZC5LXcA7ZAhNHYfqg8VRWPAXFjcv45KDJk2GeX0cVfAZDZD" },
        method: "POST",
        body: messageData,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const recipientID = body.recipient_id;
            const messageID = body.message_id;
            
            if (messageID) {
                console.log("Successfully sent message %s to recipient %s", 
                    messageID, recipientID);
            }
            else {
                console.log("Successfully called Send API for recipient %s", 
                    recipientID);
            }
        }
        else {
            console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
    });
}

module.exports = {
    receivedMessage
};