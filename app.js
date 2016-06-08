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
var billing = require('./billing');
var arm = require('./arm');

var bot = new builder.BotConnectorBot({ appId: process.env.appid, appSecret: process.env.appsecret });
bot.add('/', [function (session) {

    var chatStringVariable = session.message.text;
    // session.send('You just said: ' + chatStringVariable);
    
    // Determine intent of the user prior to assessing sentiment
    luis(process.env.luisId, process.env.luisKey, chatStringVariable, function(err, luisBody) {
        console.log(luisBody);
        if (err) {
            // Handle error   
            console.log(err);          
        }
        else{
            // Get the intent
            switch (luisBody.intents[0].intent) {
                case 'Cost':
                    session.send('Looking up your Azure resources and prices now...');
                    billing.totalCost(function(err, results) {
                        session.userData.totalCost = results;
                        session.send('You\'re spending $' + session.userData.totalCost + ' every hour.');
                        builder.Prompts.confirm(session, 'Would you like me to shut down your largest VM?');
                    });
                    break;
                case 'Count':
                    session.send('I\'m querying your subscription now, give me a second');
                     arm.login(function() {
                        arm.getVMList(function(err, vmList) {  
                            if (err)
                                console.log(err);
                            else {
                                // name: o.name, location: o.location, size: o.hardwareProfile.vmSize
                                session.userData.vmCount = vmList.length;
                                session.send('You\'ve ' + session.userData.vmCount + ' Virtual Machines running at the moment.');
                                var vms = '';
                                for (var vm in vmList) {
                                    vms += vmList[vm].name + ' in ' + vmList[vm].location + '(' + vmList[vm].size + ')\n';
                                }
                                session.send(vms);
                                builder.Prompts.confirm(session, 'Would you like me to shut down your largest VM?');
                            }
                        })
                    })
                    break;
                default:
                    session.send('I\'m afraid I can\'t to that Dave');

            }
                // session.send('I think you want me to find out ' + luisBody.intents[0].intent); // display the response to the user
        }
    }) // luis call
}, function (session, results) {
        if (results.response) {
            session.send('Total cost was $' + session.userData.totalCost + ' every hour.');
            // arm.shutDownVM(id);
            session.send('Shutting down the VM.');
            session.send("Great, Anko will be happy with that!"); 
        } else {
            session.send("OK, Anko will not be happy...");
        }
    }]);

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});