const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    facebook_id: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema)