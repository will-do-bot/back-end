const main = require('./main');
const controllerProject = require('./../controllers/project');
const controllerTask = require('./../controllers/task');

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

            if (proj && proj.length === 0) cb("E aí cara, que tal falar um projeto que existe?", null);

            // Caso exista algum projeto que atenda à condição:
            else if (proj[0]) {

                // O atributo project será igual ao id do projeto, e não mais o nome
                obj2['project'] = proj[0]['id'];

                // Identificando a ação que o usuário deseja realizar
                switch (obj['action']) {
                    case 'add':
                        controllerTask.create(obj2, (result, err) => {
                            cb(err, result);
                        });
                        break;
                    case 'remove':
                        controllerTask.removeByCond(obj2, (err, result) => {
                            if (result && result.n === 0) err = "Você não tem nenhuma tarefa com esse nome, otário";
                            cb(err, result);
                        });
                        break;
                    case 'list':
                    case 'show':
                        controllerTask.getByCond(obj2, (err, result) => {
                            if (result && result.length === 0) err = "Você não tem nenhuma tarefa com esse nome, otário";
                            cb(err, result);
                        });
                        break;
                    case 'update':
                        controllerTask.updateByCond({'name':obj['task']}, obj2, (err, result) => {
                            if (result && result.n === 0) err = "Você não tem nenhuma tarefa com esse nome, otário";
                            cb(err, result);
                        });
                        break;
                    case 'start':
                        // Fazendo get na tarefa para poder obter seu id
                        controllerTask.getByCond(obj2, (err, tarefa) => {
                            if (tarefa.length === 0) {
                                cb("Você não tem nenhuma tarefa com esse nome, otário", null);
                                return;
                            }
                            else controllerTask.start(tarefa[0]['id'], (e, r) => {
                                cb(e, r);
                            });
                        });
                        break;
                    case 'pause':
                        // Fazendo get na tarefa para poder obter seu id
                        controllerTask.getByCond(obj2, (err, tarefa) => {
                            if (tarefa.length === 0) {
                                cb("Você não tem nenhuma tarefa com esse nome, otário", null);
                                return;
                            }
                            else controllerTask.pause(tarefa[0]['id'], (e, r) => {
                                cb(e, r);
                            });
                        });
                        break;
                    case 'finish':
                        // Fazendo get na tarefa para poder obter seu id
                        if (tarefa.length === 0) {
                            cb("Você não tem nenhuma tarefa com esse nome, otário", null);
                            return;
                        }
                        else controllerTask.getByCond(obj2, (err, tarefa) => {
                            controllerTask.finish(tarefa[0]['id'], (e, r) => {
                                cb(e, r);
                            });
                        });
                        break;
                }
            }

        });
    }
}