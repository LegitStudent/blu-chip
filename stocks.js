const request = require('request');

// Make a GET Request to the following links:

// ForexProTools Pair IDs
const pairIds = ["8849", "8830", "959208"];

const options = {
    url: "https://sslcomrates.forexprostools.com/index.php",
    qs: {
        force_lang: "1",
        pairs_ids: pairIds.reduce((acc, cur, i) => {
            return acc += cur + ";";
        }, "")
    },
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36"
    }
};

/*

function callback(error, response, body) {
    if (!error && response.statusCode === 200) {
        console.log('It\'s alive!');
        
        // load response body in cheerio
        var indexWidget = cheerio.load(body);
        
        scrape(indexWidget);
    }
    else {
        console.error('An error occured. ', response.statusCode, response.statusMessage);
    }
}

*/

function parseHtml($) {
    var indexObjects = [];
    
    pairIds.forEach((pairId, index, arr) => {
    
    /*
     *  Scraping is based on the ForexProTool widget. It's best to visit the
     *  widget site itself to understand what's going on around here.
     */
        
        const rootScope = 'tr#pair_' + pairId;
        
        var indexObject = {
            name: $('span', rootScope).last().text(),
            lastPrice: $('td.pid-' + pairId + '-last', rootScope).text(),
            percentChange: $('td.pid-' + pairId + '-pcp', rootScope).text()
        };
        
        indexObjects.push(indexObject);
    });
    
    return indexObjects;
}

module.exports = {
    getIndices: function(callback) {
        request(options, callback);
    },
    parseHtml: parseHtml
};