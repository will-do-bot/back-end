const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const projectSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    deadline: {
        type: Date
    },
    priority: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cost: {
        type: Number
    },
    finishe: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Project', projectSchema)