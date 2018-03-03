const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const verify_token = 'dont_panic_42';
//Models
require('./models/Project')
const Project = mongoose.model('Project');
//Controllers
const project = require('./controllers/project');

mongoose.connect(process.env.MONGO_URI || 'mongodb://willdo:PucMinas@ds253918.mlab.com:53918/willdo')
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
                    //let answer = "Do you WillDo? You will!";
                    let answer = genAnswer(event);
                    sendMessage(event.sender.id, answer);
                }
            });
        });
        res.status(200).end();
    }
});

function genAnswer(event) {
    let answer = 'Do you WillDo? You will!';
    if (event.message.text === 'create project') {
        project.create({ 
            name: 'Projeto legal',
            description: 'Descrição legal',
            deadline: Date.now(),
            priority: 'High',
            user: 'Lucas'
        }, 
        function(err, desc) { });
        answer = 'Projeto criado';
    }
    return answer;
}

function sendMessage(sender, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: 'EAACcCV52z1oBAMsWSemRGY5RPwXaDuGyQaNvlsLPvRfiZAMYkiDzJzIZCTPhtZCJNGekusvveXZC13TANrQDk22zWUJ8Cp1tOZCl4SVafWcgOOR7GKaZB8SWZB7bWunAIwnbVWT03ZB0fFyMTB3HSvDVGZAmYPDsSXR62vxXt6ND7nip6el9ZC0NXn' },
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
