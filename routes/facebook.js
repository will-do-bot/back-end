const middle = require('./../controllers/project')
const request = require('request');
const passport = require('passport')
const dec = require('./../decoders/main');
const controller = require('./../controllers/facebook');
const userController = require('./../controllers/user');

module.exports = function (app) {

	if (app) {

		/* For Facebook Validation */
		app.get('/webhook', (req, res) => {
			if (req.query['hub.mode'] && req.query['hub.verify_token'] === verify_token) {
				res.status(200).send(req.query['hub.challenge']);
			} else {
				res.status(403).end();
			}
		});

		/* Handles messages */
		app.post('/webhook', (req, res) => {
			if (req.body.object === 'page') {
				req.body.entry.forEach((entry) => {
					entry.messaging.forEach((event) => {
						if (event.message && event.message.text) {
							userController.find(event.sender.id, user => {
								if (!user) {
									userController.save({facebook_id: event.sender.id}, saved => {
										controller.sendMessage(event.sender.id, 'Welcome!')
									})
								}
							})
							dec.decode(event.message.text, (result) => {
							
								controller.sendMessage(event.sender.id, JSON.stringify(result))
							});
						}
					});
				});
				res.status(200).end();
			}
		});

		app.get('/auth/facebook',
		passport.authenticate('facebook'));
		
		app.get('/auth/facebook/callback',
		passport.authenticate('facebook', { failureRedirect: '/login' }),
		function(req, res) {
			// Successful authentication, redirect home.
			res.redirect('/');
		});

	}

}
