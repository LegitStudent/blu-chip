// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

// Middleware setup
app.use(bodyParser.json());

// Server routing
app.get('/', function(req, res) {
    res.status(200);
    res.end('Hello, world!'); 
});

// Webhook verification
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'who_let_the_dogs_out') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});

// Messenger webhook handling
app.post('/webhook', function(req, res) {
    const data = req.body;
    
    if (data.object === 'page') {
        data.entry.forEach(function(entry) {
            const pageID = entry.id;
            const timeOfEvent = entry.time;
            // TODO: Log these entries.
            
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    receivedMessage(event);
                } else {
                  console.log("Webhook received unkown event: ", event);  
                }
            });
        });
        
        // Assuming all went well..
        // TODO: Add error handling in Webhook requests.
        res.sendStatus(200);
    }
});

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

// Server is listening
app.listen(process.env.PORT, process.env.IP, function(err) {
    if (err) throw err;
    
    console.log("Server on " + process.env.IP + " is listening on port " + process.env.PORT);
})