/* 
    Messenger/routing.js is a module that routes all Webhook callbacks from
    Facebook.
*/
 
 
// File Dependencies
const hermes = require('./sender.js');

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
        switch (messageText.toLowerCase()) {
            case "generic":
                hermes.sendGenericMessage(senderID);
                break;
            case "index":
                // Request data from widget.
                hermes.sendIndexData(senderID);
                break;

            default:
                hermes.sendTextMessage(senderID, messageText);
                break;
        }
    } else if (messageAttachments) {
        hermes.sendTextMessage(senderID, "Message with attachment received!");
    } 
}

// handles any postbacks from the webhook
function receivedPostback(event) {
    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfPostback = event.timestamp;
    
    const payload = event.postback.payload;
    
    console.log('Received postback from user %d for page %d at %d',
        senderID, recipientID, timeOfPostback);
    
    switch (payload) {
        case "START":
            // Send a welcome message telling how to request indexes.
            hermes.sendTextMessage(senderID, 
                "Hi, I'm Blu Chip! Type \"index\" to get some prices!");
            break;
            
        default:
            hermes.sendTextMessage(senderID, 
                "Unknown POSTBACK error. Pakikulit si Jasper.");
            break;
    }
}

module.exports = {
    receivedMessage,
    receivedPostback
};