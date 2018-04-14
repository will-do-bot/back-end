const main = require('./main');
const controllerProject = require('./../controllers/project');
const controllerTask = require('./../controllers/task');

module.exports = { 
    apply: function (obj, obj2, cb) {
        let understood = false;
        
        if (!obj2['name']) obj2['name'] = obj['task'];
        delete obj2.user;
        
        if (obj['action'] === 'add') {
            understood = true;
            controllerProject.getByCond({'name' : obj['project'] }, (err, res) => {
                obj2['project'] = res[0]['id'];
                controllerTask.create(obj2, (result) => cb(result));
            })
        }
        else if (obj['action'] === 'remove') {
            understood = true;
            controllerProject.getByCond({'name': obj['project'] }, (err, res) => {
                obj2['project'] = res[0]['id'];
                console.log(obj2);
                controllerTask.remove(obj2, (err, result) => cb(result));
            })
        }
        else if (obj['action'] === 'list' || obj['action'] === 'show') {
            understood = true;
            controllerProject.getByCond({'name': obj['project'] }, (err, res) => {
                obj2['project'] = res[0]['id'];
            controllerTask.getByCond(obj2, (err, result) => {
                    cb(result)
                    });
            })
        }
        else if (obj['action'] === 'update') {
            understood = true;
            controllerProject.getByCond({'name': obj['project'] }, (err, res) => {
                obj2['project'] = res[0]['id'];
                controllerTask.updateByCond({'name':obj['task']}, obj2, (err, result) => cb(result));
            })
        }
        return understood;
    }
}