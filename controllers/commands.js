
const mongoose = require('mongoose');
const Commands = mongoose.model('Commands');

module.exports = {

	update: (user, commands, cb) => {
		let c = new Commands(commands)
		c.save((err, saved) => {
			if(err) console.log(err)
			cb(saved)
		})
	},

	get: (user, cb) => {
		Commands.find({user}, (err,list) => {
			if (err) // trata erro
			cb(list)
		})
	}

}