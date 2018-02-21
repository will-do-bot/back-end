
var express = require("express");
var bodyParser = require("body-parser")


const mongoose = require('mongoose')
require('dotenv').config()
require('./models/Project')

mongoose.connect(process.env.DB_HOST)
mongoose.connection.on('error', err => {
    console.log(err.message)
})

var app = express()
app.use(bodyParser.json())

app.listen(process.env.PORT,function(){
    console.log('Listening on PORT 8080')
})

app.use(express.static(__dirname + '/public'));

app.get("/teste", function(req, res) {
  res.send({result: 'This is the Task Bot'})
})
