const controller = require('./../controllers/project');
const request = require('request');
const auth = require('./../middleware/auth');
const authC = require('./../controllers/auth');

const loggedUser = "5adb9bbc01c8433edc1582a8";

module.exports = function (app) {

    app.get('/project/:id', auth.checkAuth, auth.validate, (req, res) => {
        controller.getOne(req.params.id, function(err, obj) {
            res.status(200).send(obj);
        })
    })

    app.get('/project', auth.checkAuth,  auth.validate,(req, res) => {
        controller.list(loggedUser, function(err, obj) {
            res.status(200).send(obj);
        })
    })

    app.post('/project', auth.checkAuth,  auth.validate,(req, res) => {
        if (req.body['name']) {
            controller.create(req.body, {'facebook_id': 1636208479780756}, (result, err) => {
                if (err)
                    res.status(500).send();
                else {
                    res.status(200).send(result);
                }
            })
        }
    })

    app.put('/project/:id', auth.checkAuth,  auth.validate,(req, res) => {
        if (req.body['name']) {
            controller.update(req.params.id, req.body, (err, result) => {
                if (err)
                    res.status(500).send();
                else {
                    res.status(200).send(result);
                }
            })
        }
    })

    app.delete('/project/:id', auth.checkAuth,  auth.validate,(req, res) => {
        if (req.params.id) {
            controller.remove(req.params.id, (err, result) => {
                if (err)
                    res.status(500).send();
                else {
                    res.status(200).send(result);
                }
            })
        }
    })

}
