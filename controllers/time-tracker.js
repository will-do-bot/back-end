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
    getOne: function (id, cb) {
        TimeTracker.find({ '_id': id }, cb);
    },
    update: function (id, newObj, cb) {
        TimeTracker.update({ '_id': id }, newObj, { multi: true }, cb);
    },
    remove: function (id, cb) {
        TimeTracker.remove({ '_id': id }, cb);
    }
};
