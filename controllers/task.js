const mongoose = require('mongoose');
const Task = mongoose.model('Task');

module.exports = {
    create: function (obj, cb) {
        let task = new Task(obj);
        task.save(function (err, created) {
            if (err) cb(err);
            else cb(created);
        });
    },
    list: function (project, cb) {
        Task.find({ 'project': project }, cb);
    },
    getOne: function (project, id, cb) {
        Task.find({ 'project': project, '_id': id }, cb);
    },
    update: function (project, id, newObj, cb) {
        Task.update({ 'project': project, '_id': id }, newObj, cb);
    },
    remove: function (project, id, cb) {
        Task.remove({ 'project': project, '_id': id }, cb);
    }
};
