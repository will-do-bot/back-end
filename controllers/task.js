const mongoose = require('mongoose');
const Task = mongoose.model('Task');
const timeTracker = require('./time-tracker');
const taskChooser = require('./taskChooser');

exp = {
    create: (obj, cb) => {
        let task = new Task(obj);
        task.save(function (err, created) {
            if (err) cb(err);
            else cb(created);
        });
    },
    list: (project, cb, ordered=true) => {
        if (ordered) taskChooser.nextTasks(cb, project);
        else Task.find({ 'project': project }, cb);
    },
    listAll: (cb, ordered=true) => {
        if (ordered) taskChooser.nextTasks(cb);
        else Task.find({}, cb);
    },
    getOne: (id, cb) => {
        Task.findOne({'_id': id }, cb);
    },
    getByCond: function (cond, cb) {
        Task.find(cond, cb);
    },
    update: (id, newObj, cb) => {
        Task.update({ '_id': id }, newObj, cb);
    },
    updateByCond: (cond, newObj, cb) => {
        Task.update(cond, newObj, cb);
    },
    remove: (id, cb) => {
        Task.remove({ '_id': id }, cb);
    },
    removeByCond: (cond, cb) => {
        Task.remove(cond, cb);
    },
    start: (id, cb) => {
        Task.findOne({'_id': id}, (err, res) => {
            if (res && !res['finished']) {
                timeTracker.getActiveTimeTracker(id, (result) => {
                    if (!result) {
                        timeTracker.create({
                            task: id,
                            startDate: Date.now()
                        }, cb);
                    }
                    else cb('Já há um time tracker ativo', null);
                });
            }
            else cb('Tarefa inexistente ou finalizada', null);
        })
    },
    pause: (id, cb) => {
        Task.findOne({'_id': id}, (err, res) => {
            if (res && !res['finished']) {
                timeTracker.getActiveTimeTracker(id, (result) => {
                    if (result) {
                        timeTracker.stop(result['_id'], cb);
                    }
                    else cb('Nenhum time tracker ativo', null);
                });
            }
            else cb('Tarefa inexistente ou finalizada', null);
        });
    },
    finish: (id, cb) => {
        Task.findOne({'_id': id}, (err, res) => {
            if (res && !res['finished']) {
                timeTracker.getActiveTimeTracker(id, (result) => {
                    if (result) {
                        timeTracker.stop(result['_id'], () => {
                            Task.findOne({'_id': id}, (err, res) => {
                                res['finished'] = true;
                                Task.update({'_id': id }, res, cb);
                            });
                        });
                    }
                    else cb('Nenhum time tracker ativo', null);
                });
            }
            else cb('Tarefa inexistente ou finalizada', null);
        });
    }
};

module.exports = exp;