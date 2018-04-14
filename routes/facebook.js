const middle = require('./../controllers/project')
const request = require('request');
const passport = require('passport')
const dec = require('./../decoders/main');
module.exports = function (app) {

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
						dec.decode(event.message.text, (result) => {
							console.log(result);
							sendMessage(event.sender.id, JSON.stringify(result))
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

	function sendMessage(id, message) {
		request({
			url: 'https://graph.facebook.com/v2.6/me/messages',
			qs: { access_token: 'EAACcCV52z1oBAMsWSemRGY5RPwXaDuGyQaNvlsLPvRfiZAMYkiDzJzIZCTPhtZCJNGekusvveXZC13TANrQDk22zWUJ8Cp1tOZCl4SVafWcgOOR7GKaZB8SWZB7bWunAIwnbVWT03ZB0fFyMTB3HSvDVGZAmYPDsSXR62vxXt6ND7nip6el9ZC0NXn' },
			method: 'POST',
			json: {
				recipient: { id: id },
				message: { text: message }
			}
		}, function (error, response) {
			if (error) {
				console.log('Error sending message: ', error);
			} else if (response.body.error) {
				console.log('Error: ', response.body.error);
			}
		});
	}
}