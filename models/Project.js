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
    billable: {
        type: Boolean,
        default: false
    },
    cost: {
        type: Number,
        default: 0
    },
    finished: {
        type: Boolean,
        default: false
    }
})

projectSchema.pre('remove' ,function(next){
    console.log('Removing projects and tasks')
    const {remove} = require('./../controllers/task')
    remove(this._id, function(result){
        console.log(result)
    })
    next()
})

module.exports = mongoose.model('Project', projectSchema)