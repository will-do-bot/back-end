require('./models/Project')
require('./models/Authentication')
require('./models/User')
require('./models/Commands')
require('./models/TimeTracker')


//packages
const express = require("express");
const passport_facebook = require('passport-facebook')
const passport = require('passport')
const bodyParser = require("body-parser");
const request = require('request');
const mongoose = require('mongoose');

//database models
const Project = mongoose.model('Project');
const Authentication = mongoose.model('Authentication');
const User = mongoose.model('User');

//database config
mongoose.connect(process.env.MONGO_URI || 'mongodb://willdo:PucMinas@ds253918.mlab.com:53918/willdo')
mongoose.connection.on('error', err => {
    console.log(err.message)
})

const app = express()

// facebook auth
const verify_token = 'dont_panic_42';
app.use(passport.initialize());
app.use(passport.session());
require('./config')(app,passport)

// server config
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
app.listen(process.env.PORT || 8080,function(){
    console.log('Listening..');
})
app.use(express.static(__dirname + '/public'));
require('./routes/facebook')(app)
require('./routes/task')(app)
require('./routes/project')(app)
require('./routes/commands')(app)
require('./routes/time-tracker')(app)

// facebook login routes


// function sendMessage(sender, message) {
//     request({
//         url: 'https://graph.facebook.com/v2.6/me/messages',
//         qs: { access_token: 'EAACcCV52z1oBAMsWSemRGY5RPwXaDuGyQaNvlsLPvRfiZAMYkiDzJzIZCTPhtZCJNGekusvveXZC13TANrQDk22zWUJ8Cp1tOZCl4SVafWcgOOR7GKaZB8SWZB7bWunAIwnbVWT03ZB0fFyMTB3HSvDVGZAmYPDsSXR62vxXt6ND7nip6el9ZC0NXn' },
//         method: 'POST',
//         json: {
//             recipient: { id: sender },
//             message: { text: message }
//         }
//     }, function (error, response) {
//         if (error) {
//             console.log('Error sending message: ', error);
//         } else if (response.body.error) {
//             console.log('Error: ', response.body.error);
//         }
//     });
// }
