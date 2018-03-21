require('./models/Project')
require('./models/Authentication')
require('./models/User')
require('./models/TimeTracker')
require('./models/Task')

const express = require("express");
const passport_facebook = require('passport-facebook')
const passport = require('passport')
const bodyParser = require("body-parser");
const request = require('request');
const mongoose = require('mongoose');
require('dotenv').config();
const verify_token = 'dont_panic_42';
const Project = mongoose.model('Project');
const Authentication = mongoose.model('Authentication');
const User = mongoose.model('User');

const project = require('./controllers/project');
const app = express()
mongoose.connect(process.env.MONGO_URI || 'mongodb://willdo:PucMinas@ds253918.mlab.com:53918/willdo')
mongoose.connection.on('error', err => {
    console.log(err.message)
})

app.use(passport.initialize());
app.use(passport.session());
require('./config')(app,passport)
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 8080,function(){
    console.log('Listening..');
})

app.use(express.static(__dirname + '/public'));

require('./routes/webhook')(app)
require('./routes/task')(app)
require('./routes/project')(app)
require('./routes/time-tracker')(app)

app.get('/auth/facebook',
passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});

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
