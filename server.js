
var express = require("express");
var bodyParser = require("body-parser");


var app = express();
app.use(bodyParser.json());


app.get("/teste", function(req, res) {
  res.send({result: 'This is the Task Bot'});
});
