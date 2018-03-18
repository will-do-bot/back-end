const task_controller = require('./../controllers/task')
const request = require('request')
const auth = require('./../middleware/auth')
const auth_controller = require('./../controllers/auth')

module.exports = function (app){

    const PROJECT_NAME = "First" //arrumar referencia depois

    app.post('/task',function(req, res){
        if (req.query['name'] && PROJECT_NAME) {
            let obj = {
                'name': req.query['name'],
                'description': req.query['description'],
                'deadline': req.query['deadline'],
                'startDate': req.query['start_date'],
                'priority': req.query['priority'],
                'project': req.query['project'],
                'difficulty': req.query['difficulty'],
                'kind': req.query['kind'],
                'timeTracker': req.query['timeTracker']
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

    app.get('/task/:id', auth.checkAuth, auth.validate, (req, res) => {
        controller.getOne()
    })
    

    app.get('/task', auth.checkAuth,  auth.validate,(req, res) => {
        controller.list(PROJECT_NAME, function(err, obj) {
            res.status(200).send(obj);
        })
    })

    app.put('/task/:id', auth.checkAuth,  auth.validate,(req, res) => {
        if (req.query['name'] && PROJECT_NAME) {
            let obj = {
                'name': req.query['name'],
                'description': req.query['description'],
                'deadline': req.query['deadline'],
                'startDate': req.query['start_date'],
                'priority': req.query['priority'],
                'project': PROJECT_NAME,
                'difficulty': req.query['difficulty'],
                'kind': req.query['kind'],
                'timeTracker': req.query['timeTracker']
            };
            controller.update(PROJECT_NAME, req.params.id, obj, (err, result) => {
                if (err)
                    res.status(500).send();
                else {
                    res.status(200).send(result);
                }
            })
        }
    })

    app.delete('/task/:id', auth.checkAuth,  auth.validate,(req, res) => {
        if (req.params.id && PROJECT_NAME) {
            controller.remove(PROJECT_NAME, req.params.id, (err, result) => {
                if (err)
                    res.status(500).send();
                else {
                    res.status(200).send(result);
                }
            })
        }
    })
}
