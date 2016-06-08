/*-----------------------------------------------------------------------------
This Bot demonstrates how to use a waterfall to prompt the user with a series
of questions.

This example also shows the user of session.userData to persist information
about a specific user. 

# RUN THE BOT:

    Run the bot from the command line using "node app.js" and then type 
    "hello" to wake the bot up.
    
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./luis');

var bot = new builder.BotConnectorBot({ appId: process.env.appid, appSecret: process.env.appsecret });
bot.add('/', [function (session) {

    var chatStringVariable = session.message.text;
    
    // Determine intent of the user prior to assessing sentiment
    luis(process.env.luidId, process.env.luisKey, chatStringVariable, function(err, luisBody) {
        console.log(luisBody);
        if (err) {
            // Handle error   
            console.log(err);          
        }
        else{
        
            // Determine request
            // textAnalytics(chatStringVariable, function(err, textanalyticsBody) {
        
            // if (err) {
            //     // Handle error  
            //     console.log(err); 
            // }
            // else{
        
                // var sentimentpercent = ((textanalyticsBody.documents[0].score / 1) * 100).toFixed(2); 
                // var luisPercentageScore = ((luisBody.intents[0].score / 1) * 100).toFixed(2); 
                // var myString = luisBody.intents[0].intent + " (Lscore: " + luisPercentageScore + " Sscore: " + sentimentpercent + ")";            
                    
                session.send('Magic has happened...'); // display the response to the user
            // }
            // }) // text analytics call
        }
    }) // luis call
}, function (session, results) {
        if (results.response) {
            var responseval = results.response.entity;
            session.send("Great! Let's go get a Canoli from Mike's!"); 
        } else {
            session.send("So sorry - please cheer up!");
        }
    }]);

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});