// Package Dependencies
const express = require('express');
const bodyParser = require('body-parser');

// File Dependencies
const m = require('./messenger.js');

// Initialize app with Express framework.
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
            // const pageID = entry.id;
            // const timeOfEvent = entry.time;
            // TODO: Log these entries.
            
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    m.receivedMessage(event);
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

// Server is listening
app.listen(process.env.PORT, process.env.IP, function(err) {
    if (err) throw err;
    
    console.log("Server on " + process.env.IP + " is listening on port " + process.env.PORT);
})