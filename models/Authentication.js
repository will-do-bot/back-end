const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const projectSchema = new mongoose.Schema({
    token: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Authentication', projectSchema)