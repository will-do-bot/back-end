function compare (a, b) {
    if (a['deadline'] && b['deadline'])
        return a['deadline'] > b['deadline'];
    else if (a['deadline'])
        return false;
    else return true;
}

function ordenar (tasks, cb) {
    cb(null, tasks.sort(compare));
}

module.exports = {
    nextTasks: function (cb, project=undefined) {
        if (project)
            exp.list(project, (err, tasks) => ordenar(tasks, cb), false)
        else 
            exp.listAll((err, tasks) => ordenar(tasks, cb), false);
    },
}