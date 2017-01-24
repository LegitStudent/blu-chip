const request = require('request');

const options = {
    method: 'POST',
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: process.env.ACCESS_TOKEN },
    body: {
        setting_type: "greeting",
        greeting: {
            text: "Hello, {{user_first_name}}! I am Blu Chip, BEEP BOOP."
        }
    },
    json: true
};

request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
        console.log("Greeting Text set!");
    }
    else {
        console.error("An error occured", error, response.statusCode, response.statusMessage);
    }
});
