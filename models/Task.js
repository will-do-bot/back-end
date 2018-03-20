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
    startDate: {
        type: Date
    },
    priority: {
        type: String
    },
    project: {
        type: Number
    },
    difficulty: {
        type: Number
    },
    "type" : {
        type: String
    },
    timeTracker: {
        type: Number
    }
})

module.exports = mongoose.model('Task', projectSchema)
