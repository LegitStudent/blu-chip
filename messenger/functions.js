/*
    Messenger/functions.js is a module that defines the helper functions of the
    Blu Chip bot.
*/

// NPM Dependencies
require('dotenv').config();
const request = require('request');
const cheerio = require('cheerio');

// File Dependencies
const stockTool = require('../stocks.js');

function callSendAPI(messageData) {
    request({
        uri: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: process.env.ACCESS_TOKEN },
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
            console.error("Failed calling Send API", 
                response.statusCode, response.statusMessage, body.error);
        }
    });
}

function formatStockData(body) {
    // Load data into a Cheerio object
    var $ = cheerio.load(body);
    
    return stockTool.parseHtml($).reduce((acc, quote, index, arr) => {
        return acc + quote.name + ": " 
                + quote.lastPrice 
                + " (" + quote.percentChange + ")\n";
    }, "");
}

module.exports = {
    callSendAPI,
    formatStockData
};
