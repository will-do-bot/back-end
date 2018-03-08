require('./models/Project')
const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const mongoose = require('mongoose');
require('dotenv').config();
const verify_token = 'dont_panic_42';
const Project = mongoose.model('Project');
const project = require('./controllers/project');
const app = express()
mongoose.connect(process.env.MONGO_URI || 'mongodb://willdo:PucMinas@ds253918.mlab.com:53918/willdo')
mongoose.connection.on('error', err => {
    console.log(err.message)
})
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 8080,function(){
    console.log('Listening..');
})

app.use(express.static(__dirname + '/public'));

require('./routes/webhook')(app)
<<<<<<< HEAD
require('./routes/task')(app)

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
=======
require('./routes/project')(app)
>>>>>>> 8eca4cf5134ee17db9ee588b8e630acbc9c25226
