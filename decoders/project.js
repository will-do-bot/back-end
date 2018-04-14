const main = require('./main');
const controllerProject = require('./../controllers/project');
const controllerTask = require('./../controllers/task');

module.exports = { 
    apply: function (obj, obj2, cb) {
        let understood = false;
        
        if (!obj2['name']) obj2['name'] = obj['project'];
        
        if (obj['action'] === 'add') {
            understood = true;
            controllerProject.create(obj2, (result) => cb(result));
        }
        else if (obj['action'] === 'remove') {
            understood = true;
            controllerProject.removeByCond(obj2, (err, result) => cb(result));
        }
        else if (obj['action'] === 'list' || obj['action'] === 'show') {
            understood = true;
            controllerProject.getByCond(obj2, (err, result) => {
                cb(result)
            });
        }
        else if (obj['action'] === 'update') {
            understood = true;
            controllerProject.updateByCond({'name':obj['project']}, obj2, (err, result) => cb(result));
        }
        return understood;
    }
};