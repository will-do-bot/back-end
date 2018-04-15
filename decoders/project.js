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
        
        // Nome do projeto será igual ao atributo project, caso haja
        if (!obj2['name'] && obj['project']) obj2['name'] = obj['project'];
        
        // Identificando a ação que o usuário deseja realizar
        switch (obj['action']) {
            case 'add':
                understood = true;
                controllerProject.create(obj2, (result, err) => {
                    if (err) cb(err);
                    else cb(result);
                });
                break;
            case 'remove':
                understood = true;
                controllerProject.removeByCond(obj2, (err, result) => {
                    if (err) cb(err);
                    else cb(result);
                });
                break;
            case 'list':
            case 'show':
                understood = true;
                controllerProject.getByCond(obj2, (err, result) => {
                    if (err) cb(err);
                    else cb(result);
                });
                break;
            case 'update':
                understood = true;
                controllerProject.updateByCond({'name':obj['project']}, obj2, (err, result) => {
                    if (err) cb(err);
                    else cb(result);
                });
        }

        return understood;
    }
};