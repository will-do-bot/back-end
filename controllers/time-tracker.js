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
        TimeTracker.update({ '_id': id }, newObj, cb);
    },
    remove: function (id, cb) {
        TimeTracker.remove({ '_id': id }, cb);
    },
    getActiveTimeTracker: function (task_id, cb) {
        TimeTracker.find({ 'task': task_id }, (err, res) => {
            let encontrado = false;
            let finalizado = false;
            res.forEach((obj) => {
                if (!obj['endDate']) {
                    cb(obj);
                    encontrado = true;
                }
            });
            if (!encontrado) cb(null);
        });
    },
    stop: function (id, cb) {
        TimeTracker.findOne({ '_id': id }, (err, res) => {
            res['endDate'] = Date.now();
            TimeTracker.update({'_id': res['id']}, res, cb);
        })
    }
};
