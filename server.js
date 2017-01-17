const express = require('express');
const app = express();

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

// Messenger r


// Server is listening
app.listen(process.env.PORT, process.env.IP, function(err) {
    if (err) throw err;
    
    console.log("Server on " + process.env.IP + " is listening on port " + process.env.PORT);
})