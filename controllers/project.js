const mongoose = require('mongoose');
const Project = mongoose.model('Project');

module.exports = {
    create: function (obj, cb) {
        let project = new Project(obj);
        project.save(function (err, created) {
            if (err) cb(err);
            else cb(created);
        });
    },
    list: function (user, cb) {
        Project.find({ 'user': user }, cb);
    },
    getOne: function (id, cb) {
        Project.find({ '_id': id }, cb);
    },
    getByCond: function (cond, cb) {
        Project.find(cond, cb);
    },
    update: function (id, newObj, cb) {
        Project.update({ '_id': id }, newObj, { multi: true }, cb);
    },
    remove: function (id, cb) {
        Project.remove({ '_id': id }, cb);
    },
    removeByCond: function (cond, cb) {
        Project.remove(cond, cb);
    }
};
