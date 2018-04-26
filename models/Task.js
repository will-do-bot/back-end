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
        type: Number,
        default: 0
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    difficulty: {
        type: Number,
        default: 0
    },
    finished: {
        type: Boolean,
        default: false
    },
    started: {
        type: Boolean,
        default: false
    },
    dependencies: [
        {
            dependency: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Task'
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
})

module.exports = mongoose.model('Task', projectSchema)
