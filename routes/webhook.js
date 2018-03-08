const middle = require('./../controllers/project')
const request = require('request');
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
    app.post('/webhook', middle.exemploDeMiddleware, (req, res) => {
        if (req.body.object === 'page') {
            req.body.entry.forEach((entry) => {
                entry.messaging.forEach((event) => {
                    if (event.message && event.message.text) {
                        sendMessage(event.sender.id, '"Will WillDo Will do?"');
                    }
                });
            });
            res.status(200).end();
        }
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