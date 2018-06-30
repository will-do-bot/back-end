function checarTempoRestante(task) {
    if (!task.deadline) return 0;
    
    let dataInicio    = task.created;
    let deadline      = task.deadline;
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
    if (Date.now() >= task.startDate)
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

function checarPrioridade(task, maiorPrioridade) {
    let points = 0;
    if (task.priority > menorPrioridade) {
        if (task.priority === maiorPrioridade)
            points += 3;
        else points += 2 - (tasks.priority / maiorPrioridade);
    }
    return points;
}

function calcularPontos(tasks, cb) {
    if (tasks) {
        tasks.forEach((task, index) => {
            let maiorP = maiorPrioridade(tasks);
            let menorP = menorPrioridade(tasks);
            let points = 0;
            points += checarDataInicio(task);
            points += checarIniciada(task);
            points += checarLucratividade(task);
            points += checarPrioridade(task, maiorP, menorP);
            points += checarTempoRestante(task);
            if (task.finished) points -= 100000;
            tasks[index].points = points;
        });
    }
    if (cb) cb(tasks);
}

function maiorPrioridade(tasks) {
    return tasks ? tasks.reduce((a,b) => Math.max(a.priority, b.priority)) : null;
}

function menorPrioridade(tasks) {
    return tasks ? tasks.reduce((a,b) => Math.min(a.priority, b.priority)) : null;
}

function sort(tasks, cb) {
    if (tasks) {
        tasks.sort(function(a, b) { return b.points - a.points; })
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