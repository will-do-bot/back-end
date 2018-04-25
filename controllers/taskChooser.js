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

function checarIniciada(task) {
    if (!task['started']) return 3;
    else return 0;
}

function checarLucratividade(task) {
    return 3;
}

function checarPrioridade(task) {
    if (task['priority'] === 10)
        return 3;
    else if (task['priority'] >= 7)
        return 2;
    else if (task['priority'] >= 3)
        return 1;
    else return 0;
}

function calcularPontos(tasks, cb) {
    tasks.forEach((task, index) => {
        let points = 0;
        points += checarIniciada(task);
        points += checarLucratividade(task);
        points += checarPrioridade(task);
        points += checarTempoRestante(task);
        tasks[index]['points'] = points;
    });
    if (cb) cb();
}

function sort(tasks, cb) {
    tasks.sort(function(a, b) { return b['points'] - a['points']; })
    cb(null, tasks);
}

module.exports = {
    nextTasks: function (cb, cond) {
        if (cond) {
            require('./task').getByCond(cond, (err, tasks) => {
                calcularPontos(tasks, () => sort(tasks, cb) );
            }, false);
        }
        else {
            require('./task').listAll((err, tasks) => {
                calcularPontos(tasks, () => sort(tasks, cb) );
            }, false);
        }
    },
}