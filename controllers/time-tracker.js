const mongoose = require('mongoose');
const TimeTracker = mongoose.model('TimeTracker');

module.exports = {
    create: function (obj, cb) {
        let tt = new TimeTracker(obj);
        tt.save(function (err, created) {
            if (err) cb(err);
            else cb(created);
        });
    },
    list: function (task, cb) {
        TimeTracker.find({ 'task': task }, cb);
    },
    getOne: function (task, id, cb) {
        TimeTracker.find({ 'task': task, '_id': id }, cb);
    },
    update: function (task, id, newObj, cb) {
        TimeTracker.update({ 'task': task, '_id': id }, newObj, { multi: true }, cb);
    },
    remove: function (task, id, cb) {
        TimeTracker.remove({ 'task': task, '_id': id }, cb);
    }
};
