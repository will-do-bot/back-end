const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const User = mongoose.model('User')

module.exports = {
	create: function (project, user, cb) {
		User.findOne(user, (err, u) => {
			if (!err && u) {
				Project.findOne({ name: project['name'], finished: false }, (err, pro) => {
					if (err) throw err
					else if (pro) cb({ result: 'There is already one project with this name' })
					else {
						project.user = u._id
						new Project(project).save(function (err, created) {
							if (err) cb(err);
							else cb(created);
						})
					}
				})
			}
		})
	},
	list: function (user, cb) {
		Project.find({ 'user': user }, cb);
	},
	getOne: function (id, cb) {
		Project.findOne({ '_id': id }, cb);
	},
	getByCond: function (cond, cb) {
		Project.find(cond, cb);
	},
	update: function (id, newObj, cb) {
		Project.update({ '_id': id }, newObj, { multi: true }, cb);
	},
	updateByCond: function (cond, newObj, cb) {
		Project.update(cond, newObj, cb);
	},
	remove: function (id, cb) {
		Project.remove({ '_id': id }, cb);
	},
	removeByCond: function (cond, cb) {
		Project.remove(cond, cb);
	}
};
