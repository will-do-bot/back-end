const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const taskSchema = new mongoose.Schema({
    task: {
        type: String
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    }
})

module.exports = mongoose.model('TimeTracker', taskSchema)