const request = require('request');

const options = {
    method: 'POST',
    uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: "EAAZAhsDpOKPYBADY1DHVqlfzOc5HuwbDXQXS1gszoCQewT5Q9aJjhvePNfUED60oAtZBDl7g10pbEgdJAh4OYiGn84We4ehy7YPs0ngZBDD0oyi0lph5ZAMeYCMQxfB6HZC5LXcA7ZAhNHYfqg8VRWPAXFjcv45KDJk2GeX0cVfAZDZD" },
    body: {
        setting_type: "call_to_actions",
        thread_state: "new_thread",
        call_to_actions: [
            {
                payload: "START"
            }
        ]
    },
    json: true
};

request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
        console.log("Get Started Button set!");
        console.log(body);
    }
    else {
        console.error("An error occured", error, response.statusCode, response.statusMessage);
    }
});