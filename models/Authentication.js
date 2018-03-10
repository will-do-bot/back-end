const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const projectSchema = new mongoose.Schema({
    token: {
        type: String
    },
    user: {
        type: int
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Authentication', projectSchema)