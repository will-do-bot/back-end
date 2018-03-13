const controller = require('./../controllers/project')
const request = require('request');
const auth = require('./../middleware/auth');

module.exports = function (app) {

    app.get('/project/:id', auth.checkAuth, (req, res) => {
        controller.getOne(req.user, req.params.id, function(err, obj) {
            res.status(200).send(obj);
        })
    })

    app.get('/project', auth.checkAuth, (req, res) => {
        controller.list(req.user, function(err, obj) {
            res.status(200).send(obj);
        })
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
                    res.status(200).send(result);
                }
            })
        }
    })

    app.put('/project/:id', auth.checkAuth, (req, res) => {
        if (req.query['name'] && req.user) {
            let obj = {
                'name': req.query['name'],
                'description': req.query['description'],
                'deadline': req.query['deadline'],
                'startDate': req.query['start_date'],
                'priority': req.query['priority'],
                'user': req.user
            };
            controller.update(req.user, req.params.id, obj, (err, result) => {
                if (err)
                    res.status(500).send();
                else {
                    res.status(200).send(result);
                }
            })
        }
    })

    app.delete('/project/:id', auth.checkAuth, (req, res) => {
        if (req.params.id && req.user) {
            controller.remove(req.user, req.params.id, (err, result) => {
                if (err)
                    res.status(500).send();
                else {
                    res.status(200).send(result);
                }
            })
        }
    })

}
