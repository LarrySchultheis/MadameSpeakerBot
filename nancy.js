var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var speaker = require('./nancy.json')
const cron = require('node-cron')
const express = require('express')

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

app = express()

timeStr = speaker.targetTime.minute + " " + speaker.targetTime.hour + " * * " + speaker.targetTime.dayOfWeek
cron.schedule(timeStr, () => {
    goodMorning()
});

app.listen(3000)

function goodMorning() {

    // Initialize Nancy
    var nancy = new Discord.Client({
       token: auth.token,
       autorun: true
    });
    nancy.on('ready', function (evt) {
        logger.info('Connected');
        logger.info('Logged in as: ');
        logger.info(nancy.username + ' - (' + nancy.id + ')');

        var channelID = ""
        var channelName = speaker.targetChannel
        for (var prop in nancy.channels) {
            if (nancy.channels[prop]["name"] == channelName) {
                channelID = prop
            }
        }

        logger.info(channelID)
        logger.info(speaker.payload)

        nancy.sendMessage({
            to: channelID,
            message: speaker.payload
        })
    });


}

//Random code example for message handling

// nancy.on('message', function (user, userID, channelID, message, evt) {
//     if (message.substring(0, 1) == '!') {
//         var args = message.substring(1).split(' ');
//         var cmd = args[0];
       
//         args = args.splice(1);
//         switch(cmd) {
//             case 'nancy':
//             	var choice = Math.floor(Math.random() * 3)
//             	switch(choice) {
//             		case 0:
//             			nancy.sendMessage({
// 	                    to: channelID,
// 	                    message: 'Good morning... Sunday morning :)'});
// 	                    break;
//             		case 1:
//             			nancy.sendMessage({
// 	                    to: channelID,
// 	                    message: 'No stimmy until Uncle Joe is in office... Wait no stimmy at all.'});
// 	                    break;     
//             		case 2:
//             			nancy.sendMessage({
// 	                    to: channelID,
// 	                    message: '*Face drooping*'});
// 	                    break;                 	                                   
//             	}
                
//             break;
//             // Just add any case commands if you want to..
//          }
//      }
// });
