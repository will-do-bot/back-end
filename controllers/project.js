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
    getOne: function (user, id, cb) {
        Project.find({ 'user': user, '_id': id }, cb);
    },
    update: function (user, id, newObj, cb) {
        Project.update({ 'user': user, '_id': id }, newObj, { multi: true }, cb);
    },
    remove: function (user, id, cb) {
        Project.remove({ 'user': user, '_id': id }, cb);
    }
};
