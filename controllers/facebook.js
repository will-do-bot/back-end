var request = require('request');

module.exports = {

	sendMessage: (id, message) => {

        json = {
            "messaging_type": "RESPONSE",
            "recipient":{
                "id":id
            },
            "message":{
                "text":message
            }
        };

        url = 'https://graph.facebook.com/v2.6/me/messages?access_token=EAACcCV52z1oBADrJdO2tZBvHmYjN2Mk4Mt7chMWQHAY2HcDa7W3w6G6FVn0FMjEXPTsMDNCFYaoeULj5cqgxKje7VOFZA0DNddTfiwIQXb9nZAw8aBQ62kEzQNjMIbbpmgiLHqlbXFrlNyO0ln24Ecext4JP0rKumU0lfTunwZDZD'

        request.post(
            url,
            { json: json },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
                else console.log(body);
            }
        );
    }
    
}