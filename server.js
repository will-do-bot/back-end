
var express = require("express");
var bodyParser = require("body-parser")

const mongoose = require('mongoose')
require('./models/Project')
const User = mongoose.model('Project')

// mongoose.connect(process.env.MONGO_URI)
// mongoose.connection.on('error', err => {
//     console.log(err.message)
// })

var app = express()
app.use(bodyParser.json())

app.listen(process.env.PORT || 8080,function(){
    console.log('Listening..')
})

app.use(express.static(__dirname + '/public'));

app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'task') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})

// to post data
app.post('/webhook/', function (req, res) {
	// Parse the request body from the POST
	let body = req.body;
	
	  // Check the webhook event is from a Page subscription
	  if (body.object === 'page') {
	
		// Iterate over each entry - there may be multiple if batched
		body.entry.forEach(function(entry) {
	
		  // Get the webhook event. entry.messaging is an array, but 
		  // will only ever contain one event, so we get index 0
		  let webhook_event = entry.messaging[0];
		  console.log(webhook_event);
		  
		});
	
		// Return a '200 OK' response to all events
		res.status(200).send('EVENT_RECEIVED');
	
	  } else {
		// Return a '404 Not Found' if event is not from a page subscription
		res.sendStatus(404);
	  }
})

