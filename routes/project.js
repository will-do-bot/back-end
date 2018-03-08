const controller = require('./../controllers/project')
const request = require('request');
const middle = require('./../middleware/auth');

module.exports = function (app) {

    app.get('/project', (req, res) => {
        controller.list({ 'user': req.query['id'] }, function(err, obj) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(obj));
        })
    })

    app.post('/project', (req, res) => {
        var obj = { 'name' : req.query['name'], 'user' : req.query['id'] };
        if (req.query['name'] && req.query['id']) {
            controller.create({ 'name' : req.query['name'], 'user' : req.query['id'] }, function(err, obj) {
                if (err)
                    res.status(500).send();
                else {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(obj));
                }
            })
        }
    })

}
