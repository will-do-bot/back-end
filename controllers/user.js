
const mongoose = require('mongoose');
const User = mongoose.model('User');
const reminder = require('./reminder');

module.exports = {

	save: function (user, cb){
        let a = new User(user);
        reminder(a.facebook_id);
        a.save(function(err,save){
            if(err) console.log(err)
            cb(save)
        });
    },

    find: function (id,cb){
        User.findOne({facebook_id: id}, function(err, user){
            if(err) console.log(err)
            cb(user)
        })
    }
}