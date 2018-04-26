const controller = require('./../controllers/project');
const request = require('request');
const auth = require('./../middleware/auth');
const authC = require('./../controllers/auth');

<<<<<<< HEAD
=======
const loggedUser = "5ae0823cf654ff33f8fd253e";

>>>>>>> 9e8ddf35509028351fb02b40a3ce8c28f6457a4a
module.exports = function (app) {

    app.get('/project/:id', auth.checkAuth, auth.validate, (req, res) => {
        controller.getOne(req.params.id, function(err, obj) {
            res.status(200).send(obj);
        })
    })

    app.get('/project', auth.checkAuth,  auth.validate,(req, res) => {
        controller.list(req.token.user._id, function(err, obj) {
            res.status(200).send(obj);
        })
    })

    app.post('/project', auth.checkAuth,  auth.validate,(req, res) => {
        if (req.body['name']) {
<<<<<<< HEAD
            console.log(req.token)
            controller.create(req.body,req.token.user , (result, err) => {
=======
            controller.create(req.body, {'facebook_id': 123}, (result, err) => {
>>>>>>> 9e8ddf35509028351fb02b40a3ce8c28f6457a4a
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
