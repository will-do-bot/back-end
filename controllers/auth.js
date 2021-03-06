
const mongoose = require('mongoose');
const Auth = mongoose.model('Authentication');
const User = mongoose.model('User')

module.exports = {

    save: function (user, cb, token = '') {
        console.log('hey')
        User.findOne(user, (err, u) => {
            console.log(u)
            if (!err && u) {
                new Auth({
                    token: token || generateToken(),
                    user: u._id
                }).save((err, auth) => {
                    cb(auth)
                })
            }
        })
    },

    getToken: function (token, cb) {
        Auth.findOne({ token }).populate('user').exec(function (err, token) {
            console.log(token)
            if (err) console.log(err)
            if (token) cb(token)
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