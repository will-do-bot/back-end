const task_controller = require('./../controllers/task')
const request = require('request')
const auth = require('./../middleware/auth')
const auth_controller = require('./../controllers/auth')

module.exports = function (app) {

    // O PROJECT É SEMPRE PASSADO POR _POST
    // DEPOIS ARRUMAR TRATAMENTO DE GET VAZIO NO UPDATE
    

    app.post('/task', auth.checkAuth, auth.validate, (req, res) => {
        task_controller.create(req.body, (result, err) => {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).send(result);
        })
    })

    app.get('/task/:id', auth.checkAuth, auth.validate, (req, res) => {
        let task_id = req.params.id;
        task_controller.getOne(task_id, (err, obj) => {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).send(obj);
        })
    })


    app.get('/task', auth.checkAuth, auth.validate, (req, res) => {
        let project = req.query['project'];
        if(project != undefined){
            task_controller.list(project, (err, obj) => {
                if (err)
                    res.status(500).send(err);
                else
                    res.status(200).send(obj);
            })
        }else{
            task_controller.list_all((err, obj) => {
                if (err)
                    res.status(500).send(err);
                else
                    res.status(200).send(obj);
            })            
        }
    })

    app.get('/task', auth.checkAuth, auth.validate, (req, res) => {
        task_controller.list({}, (err, obj) => {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).send(obj);
        })
    })

    app.put('/task/:id', auth.checkAuth, auth.validate, (req, res) => {
        let obj = {
            'name': req.query['name'],
            'description': req.query['description'],
            'deadline': req.query['deadline'],
            'startDate': req.query['start_date'],
            'priority': req.query['priority'],
            'project': req.query['project'],
            'difficulty': req.query['difficulty'],
            'kind': req.query['kind']
        };
        task_controller.update(req.params.id, obj, (err, result) => {
            if (err)
                res.status(500).send();
            else
                res.status(200).send(result);
        })
    })

    app.delete('/task/:id', auth.checkAuth, auth.validate, (req, res) => {
        task_controller.remove(req.params.id, (err, result) => {
            if (err)
                res.status(500).send();
            else {
                res.status(200).send(result);
            }
        })
    })
}
