const mongoose = require('mongoose');
const Task = mongoose.model('Task');
const User = mongoose.model('User');
const Project = mongoose.model('Project');
const timeTracker = require('./time-tracker');
const taskChooser = require('./taskChooser');

function tt(i = 0, np = 0, fp = 0, report=[], tasks, cb) {
    // Percorrendo todas as tarefas
    let task = tasks[i];
    let id = task['id'];
    timeTracker.list(id, (err, timeTrackers) => {
        // Encontrando data de início da tarefa
        var ultimoTT = timeTrackers.sort(function(a, b) { return a['startDate'] < b['startDate'] })[0];
        var dataInicio;
        if (ultimoTT && ultimoTT[0]) dataInicio = ultimoTT[0];
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
        if ((task['finished'] && task['deadline']) || Date.now() > task['deadline'])
            if (noPrazo)
                np++;
            else fp++;
        // Chamada recursiva
        if (i === tasks.length - 1) {
            report = {'name': task['name'], 'prazo': np, 'foraPrazo': fp};
            cb(report);
        }
        else tt(i + 1, np, fp, report, tasks, cb);
    })
}

var exp = {
    create: (task, project, user, cb) => {
        if (!task.dependencies) {
            User.findOne(user, (err, u) => {

                Project.findOne(project, (err, p) => {
                    if (!err && p) {
                        task.project = p._id
                        task.user = u._id
                        new Task(task).save((err, t) => {
                            cb(t, err)
                        })
                    } else cb(null, err);
                })
            })

        } else cb(null, 'You need to solve the dependencies first');
    },
    list: (project, cb ) => {
        Task.find({ 'project': project }, cb);
    },
    listAll: (user, cb, ordered = true) => {
        // if (ordered) taskChooser.nextTasks(cb);
         Task.find({'user': user}).populate('project').exec(cb);
    },
    getOne: (id, cb) => {
        Task.findOne({ '_id': id }, cb);
    },
    getByCond: function (cond, cb, ordered = true) {
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
        Task.findOne({ '_id': id }, (err, res) => {
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
        Task.findOne({ '_id': id }, (err, res) => {
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
        Task.findOne({ '_id': id }, (err, res) => {
            if (res && !res['finished']) {
                timeTracker.getActiveTimeTracker(id, (result) => {
                    if (result) {
                        timeTracker.stop(result['_id'], () => {
                            Task.findOne({ '_id': id }, (err, res) => {
                                res['finished'] = true;
                                Task.update({ '_id': id }, res, cb);
                            });
                        });
                    }
                    else cb('Cara... Você sabe que essa tarefa já está rodando... Né?!', null);
                });
            }
            else cb('Maluco, essa tarefa já foi finalizada... Desencana', null);
        });
    },
    generateReport: (proj_id, cb) => {
        let report = [];
        Task.find({ 'project': proj_id }, (err, tasks) => {
            if (err) cb(err, null);
            else if (tasks) {
                tt(0, 0, 0, [], tasks, (report) => {
                    cb(null, report);
                })
            }
            else cb(err, []);
        });
    }
};

module.exports = exp;