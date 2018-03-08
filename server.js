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

app.use(bodyParser.json());

app.listen(process.env.PORT || 8080,function(){
    console.log('Listening..');
})

app.use(express.static(__dirname + '/public'));

require('./routes/webhook')(app)
require('./routes/project')(app)