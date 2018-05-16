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
    finishDate: {
        type: Date
    },
    started: {
        type: Boolean,
        default: false
    },
    timeStartDate: {
        type: Date
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

projectSchema.pre('remove', function (next) {
    const TimeTracker = mongoose.model('TimeTracker')
    const { remove } = require('./../controllers/task')
    console.log('Task and time tracker remove')
    TimeTracker.remove({ task: this._id }).exec();
    next();

});
module.exports = mongoose.model('Task', projectSchema)
