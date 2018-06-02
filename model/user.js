var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/qa', function(err) {
	if(err) {
		console.log('Database Connection Failed.....');
	}else {
		console.log('Database Connection........');
	}

});
var db = mongoose.connection;

var UserSchema = mongoose.Schema({

	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}, 
	role: {
		type: String,
		required: true
	}

});

var User = module.exports = mongoose.model('User', UserSchema);
