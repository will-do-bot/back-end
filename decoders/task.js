const main = require('./main');
const controllerProject = require('./../controllers/project');
const controllerTask = require('./../controllers/task');

module.exports = {

    /**
     * Realiza operação desejada pelo usuário
     * Recebe o objeto com a ação a ser realizada e o objeto a ser utilizado no controller
     */
    apply: function (facebook_id, obj, obj2, cb) {
        // Nome da tarefa será igual ao atributo task, caso haja
        if (!obj2['name'] && obj['task']) obj2['name'] = obj['task'];

        // Removendo atributo user do objeto enviado ao controller, já que as tarefas não o possuem
        delete obj2.user;

        // Fazendo um get para receber o projeto referente a esta tarefa
        controllerProject.getByCond({ 'name': obj['project'] }, (err, proj) => {

            if (proj && proj.length === 0 && obj['action'] != 'show' && obj['action'] != 'list')
                cb("You need to specify a valid project", null);

            // Caso exista algum projeto que atenda à condição:
            else if (proj[0] || obj['action'] === 'show' || obj['action'] === 'list') {

                // Identificando a ação que o usuário deseja realizar
                switch (obj['action']) {
                    case 'add':
                        // O atributo project será igual ao id do projeto, e não mais o nome
                        obj2['project'] = proj[0]['_id'];
                        controllerTask.create(obj2, { 'name': obj['project'] }, { 'facebook_id': facebook_id }, (result, err) => {
                            if (!err) result = "Task created!";
                            cb(err, result);
                        });
                        break;
                    case 'remove':
                        // O atributo project será igual ao id do projeto, e não mais o nome
                        obj2['project'] = proj[0]['_id'];
                        controllerTask.removeByCond(obj2._id, (result) => {
                            if (result) err = "Task not found";
                            else result = "Task deleted!";
                            cb(err, result);
                        });
                        break;
                    case 'list':
                    case 'show':
                        // mensagem de retorno melhorada apenas para o caso de listagem por project. Caso ${obj['project']} não seja definido, poderá ocorrer erro
                        // O atributo project será igual ao id do projeto, e não mais o nome
                        obj2['project'] = proj[0]['_id'];
                        controllerTask.getByCond(obj2, (err, result) => {
                            if (result && result.length === 0) err = "Task not found";
                            else if (result.length > 0) {
                                let num_registro = 1;

                                var dados = "Tasks found (" + result.length + "):\r\n\r\n";

                                // ARRUMAR MENSAGEM DE `FINISHED DATE` e `FINISH UNTIL`
                                for (let pos in result) {
                                    dados += "Task (" + (num_registro++) + ")\r\n"
                                        + "Name: \'" + result[pos].name + "\'\r\n"
                                        + "Description: " + ((result[pos].description == undefined || result[pos].description.length == 0) ? 'No description' : "\'" + result[pos].description + "\'") + "\r\n"
                                        + "Project:  " + ((obj['project'] == undefined) ? 'Default project' : "\'" + obj['project'] + "\'") + "\r\n"
                                        + "Priority: " + result[pos].priority + "\r\n"
                                        + "Difficulty: " + ((result[pos].difficulty == undefined || result[pos].difficulty.length == 0) ? '0' : result[pos].difficulty) + "\r\n"
                                        + "Started date:  " + ((result[pos].started || result[pos].finished) ? "\'" + result[pos].timeStartDate + "\'" : "Not started yet.") + "\r\n"
                                        + "Finished date: " + ((result[pos].finished) ? "\'" + result[pos].finishDate + "\'" : "Not finished yet.") + "\r\n"
                                        + "Dependencies:  [ ";
                                    if ((result[pos].dependencies.length == undefined || result[pos].dependencies.length === 0))
                                        dados += "]\r\n";
                                    else {
                                        let ultimo_nome;
                                        for (let i = 0; i < result[pos].dependencies.length - 1; i++) {
                                            controllerTask.getOne(result[pos].dependencies[i], (err, res) => {
                                                if (i < result[pos].dependencies.length - 1)
                                                    dados += res.name + ", ";
                                                else
                                                    dados += res.name + " ]\r\n";
                                            });
                                        }
                                    }
                                    var date = result[pos].created
                                    dados += "Created in: " + fix_date(""+date) + "\r\n"
                                    date = result[pos].deadline
                                    dados += "Finish until: " + fix_date(""+date) + "\r\n\r\n";
                                }
                            }
                            cb(err, dados);
                        });
                        break;
                    case 'update':
                        // O atributo project será igual ao id do projeto, e não mais o nome
                        obj2['project'] = proj[0]['_id'];
                        controllerTask.updateByCond({ 'name': obj['task'] }, obj2, (err, result) => {
                            if (result && result.n === 0) err = "Task not found";
                            else if (result.n > 0) result = "Task updated!";
                            cb(err, result);
                        });
                        break;
                    case 'start':
                        // O atributo project será igual ao id do projeto, e não mais o nome
                        obj2['project'] = proj[0]['_id'];
                        // Fazendo get na tarefa para poder obter seu id
                        controllerTask.getByCond(obj2, (err, tarefa) => {
                            if (tarefa.length === 0) {
                                cb("Task not found", null);
                                return;
                            }
                            else controllerTask.start(tarefa[0]['id'], (e, r) => {
                                if (r) r = "Task started";
                                cb(e, r);
                            });
                        });
                        break;
                    case 'pause':
                        // O atributo project será igual ao id do projeto, e não mais o nome
                        obj2['project'] = proj[0]['_id'];
                        // Fazendo get na tarefa para poder obter seu id
                        controllerTask.getByCond(obj2, (err, tarefa) => {
                            if (tarefa.length === 0) {
                                cb("Task not found", null);
                                return;
                            }
                            else controllerTask.pause(tarefa[0]['_id'], (e, r) => {
                                if (r) r = "Task paused";
                                cb(e, r);
                            });
                        });
                        break;
                    case 'finish':
                        // O atributo project será igual ao id do projeto, e não mais o nome
                        obj2['project'] = proj[0]['_id'];
                        // Fazendo get na tarefa para poder obter seu id
                        controllerTask.getByCond(obj2, (err, tarefa) => {
                            console.log("FINISHING")
                            console.log("ID: " + tarefa[0]._id)
                            if (tarefa.length === 0) {
                                console.log("NO TASK")
                                cb("Task not found", null);
                                return;
                            }
                            else controllerTask.finish(tarefa[0]._id, (e, r) => {
                                console.log("ALMOST THERE")
                                console.log(e);
                                console.log(r);
                                if (r) r = "Task finished";
                                cb(e, r);
                            });
                        });
                        break;
                    default:
                        cb("No action found", null);
                        break;
                }
            }
        });
    }
}

function fix_date(date) {
    if (date === undefined) return "Not defined";
    date = new Date(date);
    let dia, mes, ano;
    dia = date.getDate();
    mes = date.getMonth();
    ano = date.getFullYear();
    hora = date.getHours();
    minutos = date.getMinutes();
    return dia + "/" + mes + "/" + ano + " - " + hora + "h" + minutos;
}
