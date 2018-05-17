const mongoose = require('mongoose');

const timeTracker = require('./time-tracker');
const taskChooser = require('./taskChooser');
const controllerProject = require('./project');

/**
 * Gambiarra extrema que gera os dados para os gráfico de projeto
 */
function tt(i = 0, np = 0, fp = 0, report=[], tasks, proj_id, cb) {
    if (!tasks[i]) {
        controllerProject.getOne(proj_id, (err, project) => {
            report = {'name': project['name'], 'prazo': 0, 'foraPrazo': 0};
            cb(report);
        });
    }
    else {
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
            for (let i = 0; i < timeTrackers.length; i++) {
                let tt = timeTrackers[i];
                if (!dataFim || tt['endDate'] > dataFim)
                    dataFim = tt['endDate'];
            }
            if (!dataFim)
                dataFim = Date.now();
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
            if (i === tasks.length - 1 || tasks.length === 0) {
                controllerProject.getOne(proj_id, (err, project) => {
                    report = {'name': project['name'], 'prazo': np, 'foraPrazo': fp};
                    cb(report);
                })
            }
            else tt(i + 1, np, fp, report, tasks, proj_id, cb);
        })
    }
}

var exp = {
    create: (task, project, user, cb) => {
        if (!task.dependencies) {
            User.findOne(user, (err, u) => {
                Project.findOne(project, (err, p) => {
                    if (!err && p) {
                        task.name = task.name.toLowerCase();
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
         Task.find({'user': user}).populate('projects').exec(cb);
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
        Task.findOne({project: id}, function(err, task) {
            if (err) return cb(1)
            if (task) task.remove()
            cb(0)
        })
    },
    removeByCond: (id, cb) => {
        Task.findOne({id}, function(err, task) {
            if (err) return cb(1)
            if (task) task.remove()
            cb(0)
        })
    },
    start: (id, cb) => {
        Task.findOne({ '_id': id }, (err, res) => {
            if (!res['started']) {
                res['started'] = true;
                Task.update({ '_id': id }, res, () => { });
            }
            if (res && !res['finished']) {
                var date = Date.now()
                if(!res.timeStartDate) res.timeStartDate = date
                timeTracker.getActiveTimeTracker(id, (result) => {
                    if (!result) {
                        timeTracker.create({
                            task: id,
                            startDate: date
                        }, cb);

                    }
                    else cb('This task is already running', null);
                });
            }
            else cb('The desired task is finished', null);
        })
    },
    pause: (id, cb) => {
        Task.findOne({ '_id': id }, (err, res) => {
            if (res && !res['finished']) {
                timeTracker.getActiveTimeTracker(id, (result) => {
                    if (result) {
                        console.log("PAUSANDO")
                        console.log(result);
                        timeTracker.stop(result['_id'], cb);
                    }
                    else cb('You need to start the task', null);
                });
            }
            else cb('The desired task is finished', null);
        });
    },
    finish: (id, cb) => {
        Task.findOne({ '_id': id }, (err, res) => {
            if (res && !res['finished']) {
                var date = Date.now()
                res.finishDate = date
                timeTracker.getActiveTimeTracker(id, (result) => {
                    if (result) {
                        timeTracker.stop(result['_id'], date, () => {
                            Task.findOne({ '_id': id }, (err, res) => {
                                res['finished'] = true;
                                Task.update({ '_id': id }, res, cb);
                            });
                        });
                    }
                    else cb('You need to start the task', null);
                });
            }
            else cb('The task is already finished', null);
        });
    },
    generateReport: (proj_id, cb) => {
        let report = [];
        Task.find({ 'project': proj_id }, (err, tasks) => {
            if (err) cb(err, null);
            else if (tasks) {
                tt(0, 0, 0, [], tasks, proj_id, (report) => {
                    cb(null, report);
                })
            }
            else cb(err, []);
        });
    }
};

const Task = mongoose.model('Task');
const User = mongoose.model('User');
const Project = mongoose.model('Project');

module.exports = exp;
