const request = require('request');

const options = {
    method: 'POST',
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: "EAAZAhsDpOKPYBADY1DHVqlfzOc5HuwbDXQXS1gszoCQewT5Q9aJjhvePNfUED60oAtZBDl7g10pbEgdJAh4OYiGn84We4ehy7YPs0ngZBDD0oyi0lph5ZAMeYCMQxfB6HZC5LXcA7ZAhNHYfqg8VRWPAXFjcv45KDJk2GeX0cVfAZDZD" },
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