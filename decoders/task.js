const main = require('./main');
const controllerProject = require('./../controllers/project');
const controllerTask = require('./../controllers/task');

const facebook_id = "1636208479780756";

module.exports = { 

    /**
     * Realiza operação desejada pelo usuário
     * Recebe o objeto com a ação a ser realizada e o objeto a ser utilizado no controller
     */
    apply: function (obj, obj2, cb) {
        // Nome da tarefa será igual ao atributo task, caso haja
        if (!obj2['name'] && obj['task']) obj2['name'] = obj['task'];

        // Removendo atributo user do objeto enviado ao controller, já que as tarefas não o possuem
        delete obj2.user;
        
        // Fazendo um get para receber o projeto referente a esta tarefa
        controllerProject.getByCond({'name' : obj['project'] }, (err, proj) => {

            if (proj && proj.length === 0 && obj['action'] != 'show' && obj['action'] != 'list') 
                cb("You need to specify a valid project", null);

            // Caso exista algum projeto que atenda à condição:
            else if (proj[0] || obj['action'] === 'show' || obj['action'] === 'list') {
                
                // Identificando a ação que o usuário deseja realizar
                switch (obj['action']) {
                    case 'add':
                        // O atributo project será igual ao id do projeto, e não mais o nome
                        obj2['project'] = proj[0]['id'];
                        controllerTask.create(obj2, {'name': obj['project']}, {'facebook_id': facebook_id}, (err, result) => {
                            if (!err) result = "Task created!";
                            cb(err, result);
                        });
                        break;
                    case 'remove':
                        // O atributo project será igual ao id do projeto, e não mais o nome
                        obj2['project'] = proj[0]['id'];
                        controllerTask.removeByCond(obj2, (err, result) => {
                            if (result && result.n === 0) err = "Task not found";
                            else if (result.n > 0) result = "Taks deleted!";
                            cb(err, result);
                        });
                        break;
                    case 'list':
                    case 'show':
                        // O atributo project será igual ao id do projeto, e não mais o nome
                        if (obj['project']) obj2['project'] = proj[0]['id'];
                        controllerTask.getByCond(obj2, (err, result) => {
                            if (result && result.length === 0) err = "Task not found";
                            cb(err, result);
                        });
                        break;
                    case 'update':
                        // O atributo project será igual ao id do projeto, e não mais o nome
                        obj2['project'] = proj[0]['id'];
                        controllerTask.updateByCond({'name':obj['task']}, obj2, (err, result) => {
                            if (result && result.n === 0) err = "Task not found";
                            else if (result.n > 0) result = "Task updated!";
                            cb(err, result);
                        });
                        break;
                    case 'start':
                        // O atributo project será igual ao id do projeto, e não mais o nome
                        obj2['project'] = proj[0]['id'];
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
                        obj2['project'] = proj[0]['id'];
                        // Fazendo get na tarefa para poder obter seu id
                        controllerTask.getByCond(obj2, (err, tarefa) => {
                            if (tarefa.length === 0) {
                                cb("Task not found", null);
                                return;
                            }
                            else controllerTask.pause(tarefa[0]['id'], (e, r) => {
                                if (r) r = "Task paused";
                                cb(e, r);
                            });
                        });
                        break;
                    case 'finish':
                        // O atributo project será igual ao id do projeto, e não mais o nome
                        obj2['project'] = proj[0]['id'];
                        // Fazendo get na tarefa para poder obter seu id
                        controllerTask.getByCond(obj2, (err, tarefa) => {
                            if (tarefa.length === 0) {
                                cb("Task not found", null);
                                return;
                            }
                            else controllerTask.finish(tarefa[0]['id'], (e, r) => {
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