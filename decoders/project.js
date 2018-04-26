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
        // Nome do projeto será igual ao atributo project, caso haja
        if (!obj2['name'] && obj['project']) obj2['name'] = obj['project'];
        
        // Identificando a ação que o usuário deseja realizar
        switch (obj['action']) {
            case 'add':
                controllerProject.create(obj2, {facebook_id: facebook_id}, (result, err) => {
                    if (!err) result = "Project created!";
                    cb(err, result);
                });
                break;
            case 'remove':
                controllerProject.removeByCond(obj2,'name' (err, result) => {
                    if (result && result.n === 0) err = "Project not found"
                    else if (result.n > 0) result = "Project deleted!";
                    cb(err, result);
                });
                break;
            case 'list':
            case 'show':
                controllerProject.getByCond(obj2, (err, result) => {
                    if (result && result.length === 0) err = "Project not found";
                    cb(err, result);
                });
                break;
            case 'update':
                controllerProject.updateByCond({'name':obj['project']}, obj2, (err, result) => {
                    if (result && result.n === 0) err = "Project not found?";
                    else if (result.n > 0) result = "Project updated!";
                    cb(err, result);
                });
            default:
                cb("No action found!", null);
                break;
        }
    }
};