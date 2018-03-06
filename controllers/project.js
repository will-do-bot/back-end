const mongoose = require('mongoose');
const Project = mongoose.model('Project');

module.exports = {
    create: function(obj, cb) {
        let project = new Project(obj);
		project.save(function(err, created) {
            //if(err) handlesError(err);
            if (err) console.log(err);
            cb(created);
            next()
        });
    },
    list: function(query={ }, cb) {
        Project.find(query, cb);
    },
    update: function(conditions, newObj, cb) {
        Project.update(conditions, newObj, { multi: true }, cb);
    },
    remove: function(conditions, cb) {
        Project.remove(conditions, cb);
    }
};