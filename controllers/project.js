const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const User = mongoose.model('User');
const Task = mongoose.model('Task');

module.exports = {
	create: function (project, user, cb) {
		User.findOne(user, (err, u) => {
			if (!err && u) {
				project['name'] = project['name'].toLowerCase();
				Project.findOne({ name: project['name'], finished: false }, (err, pro) => {
					if (err) cb(null, err);
					else if (pro) cb(null, { result: 'There is already a project with this name' })
					else {
						project.user = u._id;
						new Project(project).save(function (err, created) {
							cb(created, err);
						})
					}
				})
			} else cb(null, err);
		})
	},
	list: function (user, cb) {
		Project.find({ 'user': { '_id': user } }, cb);
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
		
		Project.find({'_id': cond['id']}, (err, res) => {
			if(res && !err){
				let id_proj = res[0]['id'];

				Task.remove({'project': id_proj}, (err, res) => {
					if(!err) Project.remove(cond, cb);
				});
			}
		})
	}
};
