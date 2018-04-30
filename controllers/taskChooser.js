const taskController = require('./task');

function checarTempoRestante(task) {
    if (!task['deadline']) return 0;
    
    let dataInicio    = task['created'];
    let deadline      = task['deadline'];
    let tempoAtual    = Date.now();
    
    let tempoInicial  = deadline - dataInicio;
    let tempoRestante = deadline - tempoAtual;
    
    if (tempoRestante <= tempoInicial / 10)
        return 3;
    else if (tempoRestante <= tempoInicial / 5)
        return 2;
    else if (tempoRestante <= tempoInicial / 2)
        return 1;
    
    return 0;
}

function checarDataInicio(task) {
    if (Date.now() >= task['startDate'])
        return 100;
    return 0;
}

function checarIniciada(task) {
    if (!task['started']) return 3;
    else return 0;
}

function checarLucratividade(task) {
    return 3;
}

function checarPrioridade(task, cb) {
    let points = 0;
    if (task['priority'] === 10)
        points += 3;
    else if (task['priority'] >= 7)
        points += 2;
    else if (task['priority'] >= 3)
        points += 1;
    return points;
}

function calcularPontos(tasks, cb) {
    if (tasks) {
        tasks.forEach((task, index) => {
            let points = 0;
            points += checarDataInicio(task);
            points += checarIniciada(task);
            points += checarLucratividade(task);
            points += checarPrioridade(task);
            points += checarTempoRestante(task);
            if (task['finished']) points -= 100000;
            tasks[index]['points'] = points;
        });
    }
    if (cb) cb(tasks);
}

function sort(tasks, cb) {
    if (tasks) {
        tasks.sort(function(a, b) { return b['points'] - a['points']; })
    }
    cb(null, tasks);
}

module.exports = {
    nextTasks: function (cb, cond) {
        if (cond) {
            require('./task').getByCond(cond, (err, tasks) => {
                calcularPontos(tasks, (res) => sort(res, cb) );
            }, false);
        }
        else {
            require('./task').listAll((err, tasks) => {
                calcularPontos(tasks, (res) => sort(res, cb) );
            }, false);
        }
    },
}