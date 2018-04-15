const main = require('./main');
const controllerProject = require('./../controllers/project');
const controllerTask = require('./../controllers/task');

module.exports = { 

    /**
     * Realiza operação desejada pelo usuário
     * Recebe o objeto com a ação a ser realizada e o objeto a ser utilizado no controller
     **/
    apply: function (obj, obj2, cb) {
        let understood = false;
        
        // Nome da tarefa será igual ao atributo task, caso haja
        if (!obj2['name'] && obj['task']) obj2['name'] = obj['task'];

        // Removendo atributo user do objeto enviado ao controller, já que as tarefas não o possuem
        delete obj2.user;
        
        // Fazendo um get para receber o projeto referente a esta tarefa
        controllerProject.getByCond({'name' : obj['project'] }, (err, proj) => {

            if (err) cb(err);

            // Caso exista algum projeto que atenda à condição:
            else if (proj[0]) {

                // O atributo project será igual ao id do projeto, e não mais o nome
                obj2['project'] = proj[0]['id'];

                // Identificando a ação que o usuário deseja realizar
                switch (obj['action']) {
                    case 'add':
                        controllerTask.create(obj2, (result, err) => {
                            if (err) cb(err);
                            else cb(result)
                        });
                        break;
                    case 'remove':
                        controllerTask.removeByCond(obj2, (err, result) => {
                            if (err) cb(err);
                            else cb(result)
                        });
                        break;
                    case 'list':
                    case 'show':
                        controllerTask.getByCond(obj2, (err, result) => {
                            if (err) cb(err);
                            else cb(result)
                        });
                        break;
                    case 'update':
                        controllerTask.updateByCond({'name':obj['task']}, obj2, (err, result) => {
                            if (err) cb(err);
                            else cb(result)
                        });
                        break;
                    case 'start':
                        // Fazendo get na tarefa para poder obter seu id
                        controllerTask.getByCond(obj2, (err, tarefa) => {
                            controllerTask.start(tarefa[0]['id'], (e, r) => {
                                if (e) cb(e);
                                else cb(r)
                            });
                        });
                        break;
                    case 'pause':
                        // Fazendo get na tarefa para poder obter seu id
                        controllerTask.getByCond(obj2, (err, tarefa) => {
                            controllerTask.pause(tarefa[0]['id'], (e, r) => {
                                if (e) cb(e);
                                else cb(r)
                            });
                        });
                        break;
                    case 'finish':
                        // Fazendo get na tarefa para poder obter seu id
                        controllerTask.getByCond(obj2, (err, tarefa) => {
                            controllerTask.finish(tarefa[0]['id'], (e, r) => {
                                if (e) cb(e);
                                else cb(r)
                            });
                        });
                        break;
                }
            }

        });

        return true;
    }
}