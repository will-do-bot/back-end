
const middle = require('./../middleware/auth')
const controller = require('./../controllers/commands')

module.exports = function (app) {

	app.put('/command',
		middle.checkAuth,
		middle.validate,
		function (req, res) {
			controller.update(req.token.user,req.body, (result) => {
				res.send(result)
			}
			)
		})


}