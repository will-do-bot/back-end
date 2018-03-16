
const authController = require('./../controllers/auth')

module.exports = {

    checkAuth: function (req, res, next) {
        if (req.auth)
            next();
        else
            res.status(400).send({ error: 'FORBIDDEN' })
    },

    validate: function (req, res, next) {
        if (authController.getToke(req.auth))
            next();
        else
            res.status(400).send({ error: 'FORBIDDEN' })

    }

};