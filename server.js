require('./models/Project')
require('./models/Authentication')
require('./models/User')
require('./models/Commands')
require('./models/TimeTracker')
require('./models/Task')

//packages
const express = require("express");
const passport_facebook = require('passport-facebook')
const passport = require('passport')
const bodyParser = require("body-parser");
const request = require('request');
const mongoose = require('mongoose');
const decoder = require('./decoders/main');

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
    //console.log('Listening..');
})
app.use(express.static(__dirname + '/public'));
require('./routes/facebook')(app)
require('./routes/task')(app)
require('./routes/project')(app)
require('./routes/commands')(app)
require('./routes/time-tracker')(app)

//Alternativas naturais:
console.log(decoder.decode('add a new project called good swampum with high priority, deadline equal to 2018-03-27 and description = "welcome to the new world order"'));
console.log(decoder.decode('list all projects with priority high'));
console.log(decoder.decode('show project named swampum'));
console.log(decoder.decode('list tasks from project swampum'));
console.log(decoder.decode('show projects with priority equal to 10'));
console.log(decoder.decode('remove project where name = good swampum'));

console.log("-----");

//Alternativas robóticas:
console.log(decoder.decode('add project name good swapum priority high deadline 2018-03-27'));
console.log(decoder.decode('list projects priority high'));
console.log(decoder.decode('show project name swampum'));
console.log(decoder.decode('list tasks project swampum'));
console.log(decoder.decode('show projects priority 10'));
console.log(decoder.decode('remove project name good swampum'));