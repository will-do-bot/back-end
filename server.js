
var express = require("express");
var bodyParser = require("body-parser")

const mongoose = require('mongoose')
require('./models/Project')
const User = mongoose.model('Project')

mongoose.connect(process.env.MONGO_URI)
mongoose.connection.on('error', err => {
    console.log(err.message)
})

var app = express()
app.use(bodyParser.json())

app.listen(process.env.PORT || 8080,function(){
    console.log('Listening..')
    console.log(process.env.MONGODB_URI)
})

app.use(express.static(__dirname + '/public'));

app.post("/teste", function(req, res) {

  const user =  (new User({name: 'matheus', description: 'desc'}))
  user.save((err, savedUser) => {
      if (err)
          return next({message: err.message, status: 400})
      console.log(savedUser)
      res.status(200).send(savedUser)
  })
})
