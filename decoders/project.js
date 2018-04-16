const main = require('./main');
const controllerProject = require('./../controllers/project');
const controllerTask = require('./../controllers/task');

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
                controllerProject.create(obj2, (result, err) => {
                    if (!err) result = "Projeto inserido com sucesso!";
                    cb(err, result);
                });
                break;
            case 'remove':
                controllerProject.removeByCond(obj2, (err, result) => {
                    if (result && result.n === 0) err = "E aí cara, que tal falar um projeto que existe?"
                    else if (result.n > 0) result = "Projeto removido com sucesso!";
                    cb(err, result);
                });
                break;
            case 'list':
            case 'show':
                controllerProject.getByCond(obj2, (err, result) => {
                    if (result && result.length === 0) err = "E aí cara, que tal falar um projeto que existe?";
                    cb(err, result);
                });
                break;
            case 'update':
                controllerProject.updateByCond({'name':obj['project']}, obj2, (err, result) => {
                    if (result && result.n === 0) err = "E aí cara, que tal falar um projeto que existe?";
                    else if (result.n > 0) result = "Projeto atualizado com sucesso!";
                    cb(err, result);
                });
            default:
                cb("Mano, você precisa escolher uma ação", null);
                break;
        }
    }
};