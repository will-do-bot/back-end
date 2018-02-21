
var express = require("express");
var bodyParser = require("body-parser")

const mongoose = require('mongoose')
require('dotenv').config()
require('./models/Project')
const User = mongoose.model('Project')
mongoose.connect(process.env.DB_HOST)
mongoose.connection.on('error', err => {
    console.log(err.message)
})

var app = express()
app.use(bodyParser.json())

app.listen(process.env.PORT || 8080,function(){
    console.log('Listening..')
})

app.use(express.static(__dirname + '/public'));

app.post("/teste", function(req, res) {

  const user =  (new User(req.body))
  user.save((err, savedUser) => {
      if (err)
          return next({message: err.message, status: 400})
      res.status(200).send(savedUser)
  })
})
