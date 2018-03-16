const controller = require('./../controllers/project')
const request = require('request');
const auth = require('./../middleware/auth');
const authC = require('./../controllers/auth')

module.exports = function (app) {

    app.get('/project/:id', auth.checkAuth, auth.validate, (req, res) => {
        controller.getOne(1636208479780756, req.params.id, function(err, obj) {
            res.status(200).send(obj);
        })
    })

    app.get('/project', auth.checkAuth,  auth.validate,(req, res) => {
        controller.list(1636208479780756, function(err, obj) {
            res.status(200).send(obj);
        })
    })

    app.post('/project', auth.checkAuth,  auth.validate,(req, res) => {
        if (req.query['name'] && 1636208479780756) {
            let obj = {
                'name': req.query['name'],
                'description': req.query['description'],
                'deadline': req.query['deadline'],
                'startDate': req.query['start_date'],
                'priority': req.query['priority'],
                'user': 1636208479780756
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

    app.put('/project/:id', auth.checkAuth,  auth.validate,(req, res) => {
        if (req.query['name'] && 1636208479780756) {
            let obj = {
                'name': req.query['name'],
                'description': req.query['description'],
                'deadline': req.query['deadline'],
                'startDate': req.query['start_date'],
                'priority': req.query['priority'],
                'user': 1636208479780756
            };
            controller.update(1636208479780756, req.params.id, obj, (err, result) => {
                if (err)
                    res.status(500).send();
                else {
                    res.status(200).send(result);
                }
            })
        }
    })

    app.delete('/project/:id', auth.checkAuth,  auth.validate,(req, res) => {
        if (req.params.id && 1636208479780756) {
            controller.remove(1636208479780756, req.params.id, (err, result) => {
                if (err)
                    res.status(500).send();
                else {
                    res.status(200).send(result);
                }
            })
        }
    })

}
