const mongoose = require('mongoose');
const Task = mongoose.model('Task');

module.exports = {
    create: (obj, cb) => {
        let task = new Task(obj);
        task.save(function (err, created) {
            if (err) cb(err);
            else cb(created);
        });
    },
    list: (project, cb) => {
        Task.find({ 'project': project }, cb);
    },
    list_all: (cb) => {
        Task.find({}, cb);
    },
    getOne: (id, cb) => {
        Task.find({'_id': id }, cb);
    },
    getByCond: function (cond, cb) {
        Task.find(cond, cb);
    },
    update: (id, newObj, cb) => {
        // Task.update({ '_id': id }, newObj, cb);
    },
    updateByCond: (cond, newObj, cb) => {
        Task.update(cond, newObj, cb);
    },
    remove: (id, cb) => {
        Task.remove({ '_id': id }, cb);
    },
    removeByCond: (cond) => {
        Task.remove(cond, cb);
    }
};
