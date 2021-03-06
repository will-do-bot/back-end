const task_controller = require('./../controllers/task')
const request = require('request')
const auth = require('./../middleware/auth')
const auth_controller = require('./../controllers/auth')

module.exports = function (app) {

    app.post('/task', auth.checkAuth, auth.validate, (req, res) => {
        task_controller.create(req.body, {'_id': req.body['project']}, req.token.user._id, (result, err) => {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).send(result);
        });
    });

    app.get('/task/:id', auth.checkAuth, auth.validate, (req, res) => {
        let task_id = req.params.id;
        task_controller.getOne(task_id, (err, obj) => {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).send(obj);
        });
    });

    app.get('/task/project/:id', auth.checkAuth, auth.validate, (req, res) => {
        task_controller.getByCond({'project': req.params.id}, (err, obj) => {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).send(obj);
        });
    });

    app.get('/task', auth.checkAuth, auth.validate, (req, res) => {
        task_controller.getByCond({'user': req.token.user.id},(err, obj) => {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).send(obj);
        });
    });

    app.put('/task/:id', auth.checkAuth, auth.validate, (req, res) => {
        task_controller.update(req.params.id, req.body, (err, result) => {
            if (err)
                res.status(500).send();
            else
                res.status(200).send(result);
        });
    });

    app.delete('/task/:id', auth.checkAuth, auth.validate, (req, res) => {
        task_controller.removeByCond(req.params.id, (err) => {
            if (err)
                res.status(500).send();
            else {
                res.status(200).send();
            }
        });
    });
    
    app.post('/task/start/:id', auth.checkAuth, auth.validate, (req, res) => {
        task_controller.start(req.params.id, (err, result) => {
            if (err) 
                res.status(500).send(err);
            else
                res.status(200).send(result);
        });
    });
    
    app.post('/task/pause/:id', auth.checkAuth, auth.validate, (req, res) => {
        task_controller.pause(req.params.id, (err, result) => {
            if (err) 
                res.status(500).send(err);
            else
                res.status(200).send(result);
        });
    });
    
    app.post('/task/finish/:id', auth.checkAuth, auth.validate, (req, res) => {
        task_controller.finish(req.params.id, (err, result) => {
            if (err) 
                res.status(500).send(err);
            else
                res.status(200).send(result);
        })
    })

    app.get('/task/:id/reports/', auth.checkAuth, auth.validate, (req, res) => {
        task_controller.generateReport(req.params.id, (err, result) => {
            if (err)
                res.status(500).send(err);
            else
                res.status(200).send(result);
        })
    })
};
