
var express = require("express");
var bodyParser = require("body-parser")


var app = express()
app.use(bodyParser.json())

app.listen(8080,function(){
    console.log('Listening on PORT 8080')
})

app.get("/teste", function(req, res) {
  res.send({result: 'This is the Task Bot'})
})
