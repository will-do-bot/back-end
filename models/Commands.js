
const mongoose = require('mongoose')

const commandsSchema = new mongoose.Schema({
    add: {
        type: String,
        default: 'add'
    },
    pause: {
        type: String,
        default: 'pause'
    },
    finish: {
        type: String,
        default: 'finish'
    },
    edit: {
        type: String,
        default: 'edit'
    },
    list: {
        type: String,
        default: 'list'
    }
})

module.exports = mongoose.model('Commands', projectSchema)