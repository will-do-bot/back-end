
const mongoose = require('mongoose');
const Auth = mongoose.model('Authentication');

module.exports = {

    create: function (user, cb) {
        let auth = new Auth({
            user,
            token: generateToken()
        })
        auth.save(function (err, saved) {
            if (err) console.log(err)
            cb(saved)
        })
    },

    getToken: function (token, cb){
        Auth.findOne({token}, function(err, token){
            if (err) console.log(err)
            if(token) cb(true)
            else cb(false)
        })
    }

}

function generateToken() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16 % 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}