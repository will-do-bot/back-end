
const authController = require('./../controllers/auth')

module.exports = {

    checkAuth: function (req, res, next) {
        if (req.get('auth_key'))
            next();
        else
            res.status(400).send({ error: 'FORBIDDEN' })
    },

    validate: function (req, res, next) {
        console.log(req.get('auth_key'))
        authController.getToken(req.get('auth_key'), (resul) => {
            if (resul)
                next();
            else
                res.status(400).send({ error: 'FORBIDDEN' })
        })

    }

};