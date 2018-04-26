const controller = require('./../controllers/time-tracker')
const request = require('request');
const auth = require('./../middleware/auth');
const authC = require('./../controllers/auth')

module.exports = function (app) {

    app.get('/time_tracker/:id', auth.checkAuth, auth.validate, (req, res) => {
        controller.getOne(req.params.id, function (err, obj) {
            res.status(200).send(obj);
        })
    })

    app.get('/time_tracker', auth.checkAuth, auth.validate, (req, res) => {
        if (req.query['task']) {
            controller.list(req.query['task'], function (err, obj) {
                res.status(200).send(obj);
            })
        }
    })

    app.post('/time_tracker', auth.checkAuth, auth.validate, (req, res) => {
        if (req.body['task'] && req.body['startDate'] && req.body['endDate']) {
            controller.create(req.body, (result, err) => {
                if (err)
                    res.status(500).send();
                else {
                    res.status(200).send(result);
                }
            })
        }
    })

    app.put('/time_tracker/:id', auth.checkAuth, auth.validate, (req, res) => {
        if (req.body['task'] && req.body['startDate'] && req.body['endDate']) {
            controller.update(req.params.id, req.body, (err, result) => {
                if (err)
                    res.status(500).send();
                else {
                    res.status(200).send(result);
                }
            })
        }
    })

    app.delete('/time_tracker/:id', auth.checkAuth, auth.validate, (req, res) => {
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

    app.post('/allTime', (req, res) => {
        var time = 0
        controller.list(req.body.task, (err, resposta) => {
            if (resposta) {
                for (const element of resposta) {
                    var endDate = element.endDate || new Date()
                    var timeDiff = Math.abs(endDate.getTime() - element.startDate.getTime())
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    time = time + diffDays
                }
            }
                res.send({ diffDays: time })
        })
    })
}
