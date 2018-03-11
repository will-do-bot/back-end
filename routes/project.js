const controller = require('./../controllers/project')
const request = require('request');
const auth = require('./../middleware/auth');

module.exports = function (app) {

    app.get('/project', auth.checkAuth, (req, res) => {
        if (req.query['id']) {
            controller.getOne(req.user, req.query['id'], function(err, obj) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(obj));
            })
        } 
        else {
            controller.list(req.user, function(err, obj) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(obj));
            })
        }  
    })

    app.post('/project', auth.checkAuth, (req, res) => {
        if (req.query['name'] && req.user) {
            let obj = {
                'name': req.query['name'],
                'description': req.query['description'],
                'deadline': req.query['deadline'],
                'startDate': req.query['start_date'],
                'priority': req.query['priority'],
                'user': req.user
            };
            controller.create(obj, (result, err) => {
                if (err)
                    res.status(500).send();
                else {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(result));
                }
            })
        }
    })

    app.put('/project', auth.checkAuth, (req, res) => {
        if (req.query['id'] && req.query['name'] && req.user) {
            let obj = {
                'name': req.query['name'],
                'description': req.query['description'],
                'deadline': req.query['deadline'],
                'startDate': req.query['start_date'],
                'priority': req.query['priority'],
                'user': req.user
            };
            controller.update(req.user, req.query['id'], obj, (err, result) => {
                if (err)
                    res.status(500).send();
                else {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(result));
                }
            })
        }
    })

    app.delete('/project', auth.checkAuth, (req, res) => {
        if (req.query['id'] && req.user) {
            controller.remove(req.user, req.query['id'], (err, result) => {
                if (err)
                    res.status(500).send();
                else {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(result));
                }
            })
        }
    })

}
