// ------ luis.js ---------
"use strict";

var request = require("request");

module.exports = function(appId, appSecret, utterance, callback) {
    var reqObj = {
        url: "https://api.projectoxford.ai/luis/v1/application",
        qs: {
            "id": appId,
            "subscription-key": appSecret,
            "q": utterance
        }
    };
    request(reqObj, function(err, resp, body) {
        if (err) {
            return callback(err);
        }

        if (resp.statusCode > 299) {
            return callback(new Error("LUIS call failed with: (" + resp.statusCode + ") " + body));
        }

        return callback(null, body ? JSON.parse(body) : "");
    });
};

