const mongoose = require('mongoose');
const Task = mongoose.model('Task');
const Project = mongoose.model('Project');
const timeTracker = require('./time-tracker');
const taskChooser = require('./taskChooser');

var exp = {
    create: (task, project, cb) => {
        if (!task.dependencies){
            Project.findOne(project, (err,p) => {
                if(!err && p) {
                    task.project = p._id
                    new Task(task).save((err, t) => {
                        cb(t, err)
                    })
                } else cb(null, err);
            })
        } else cb(null, 'You need to solve the dependencies first');
    },
    list: (project, cb) => {
        Task.find({ 'project': project }, cb);
    },
    listAll: (cb, ordered=true) => {
        if (ordered) taskChooser.nextTasks(cb);
        else Task.find({}, cb);
    },
    getOne: (id, cb) => {
        Task.findOne({'_id': id }, cb);
    },
    getByCond: function (cond, cb, ordered=true) {
        if (ordered) taskChooser.nextTasks(cb, cond);
        else Task.find(cond, cb);
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
            if (!res['started']) {
                res['started'] = true;
                Task.update({ '_id': id }, res, () => { });
            }
            if (res && !res['finished']) {
                timeTracker.getActiveTimeTracker(id, (result) => {
                    if (!result) {
                        timeTracker.create({
                            task: id,
                            startDate: Date.now()
                        }, cb);
                    }
                    else cb('Cara... Você sabe que essa tarefa já está rodando... Né?!', null);
                });
            }
            else cb('Maluco, essa tarefa já foi finalizada... Desencana', null);
        })
    },
    pause: (id, cb) => {
        Task.findOne({'_id': id}, (err, res) => {
            if (res && !res['finished']) {
                timeTracker.getActiveTimeTracker(id, (result) => {
                    if (result) {
                        timeTracker.stop(result['_id'], cb);
                    }
                    else cb('Cara... Você sabe que essa tarefa já está rodando... Né?!', null);
                });
            }
            else cb('Maluco, essa tarefa já foi finalizada... Desencana', null);
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
                    else cb('Cara... Você sabe que essa tarefa já está rodando... Né?!', null);
                });
            }
            else cb('Maluco, essa tarefa já foi finalizada... Desencana', null);
        });
    },
    generateReport: (id, cb) => {
        let report = [];
        Task.find({ }, (err, tasks) => {
            if (err) cb(err, null);
            else if (tasks) {
                // Percorrendo todas as tarefas
                tasks.forEach((task) => {
                    timeTracker.list(id, (err, timeTrackers) => {
                        // Encontrando data de início da tarefa
                        var dataInicio = timeTrackers.sort(function(a, b) { return a['startDate'] < b['startDate'] })[0];
                        // Encontrando data de término da tarefa
                        var dataFim = dataInicio;
                        timeTrackers.forEach(tt => {
                            if (!tt['endDate']) {
                                dataFim = Date.now();
                                return;
                            }
                            else if (tt['endDate'] > dataFim)
                            dataFim = tt['endDate'];
                        })
                        // Verificando se está no prazo
                        var noPrazo = false;
                        if (task['finished'] && dataFim <= task['deadline'])
                            noPrazo = true;
                        // Adicionando no vetor
                        report.push({'name': task['name']})
                    })
                });
            }
            else cb(err, []);
        });
    }
};

module.exports = exp;