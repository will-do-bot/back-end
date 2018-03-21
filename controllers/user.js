
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {

	save: function (user, cb){
        let a = new User(user)
        a.save(function(err,save){
            if(err) console.log(err)
            cb(save)
        })
    },

    find: function (id,cb){
        User.findOne({facebook_id: id}, function(err, user){
            if(err) console.log(err)
            cb(user)
        })
    }
}