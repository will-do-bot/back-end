const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const verify_token = 'tuxedo_cat';
//Models
const Project = mongoose.model('Project');

mongoose.connect(process.env.MONGO_URI || 'mongodb://prod:taskbot@ds243728.mlab.com:43728/taskbot')
mongoose.connection.on('error', err => {
    console.log(err.message)
})

app.use(bodyParser.json());

app.listen(process.env.PORT || 8080,function(){
    console.log('Listening..');
})

app.use(express.static(__dirname + '/public'));

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === verify_token) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).end();
    }
});
  
/* Handles messages */
app.post('/webhook', (req, res) => {
    console.log(req.body);
    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                if (event.message && event.message.text) {
					let answer = "Do you WillDo? You will!";
                    sendMessage(event.sender.id, answer);
                }
            });
        });
        res.status(200).end();
    }
});

function sendMessage(sender, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: 'EAACDnQfxGoMBAHhho7WogS6yMPv0bff9Q9F1ZBGN2fgZAoWZAAq5nTAkJo3pj0Vjn5ZAmpSKjrslNL4a57aDvfkERAZAMsoV8M9KL9PP5kSW8ivg9tUakiogmrkSqunZASWNT9LoMo27MwMOFE0QmQNWbDKTO8po5bzuSDoHEuaBT9dbxdpA47' },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: { text: message }
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}
