var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/qa', function(err) {
	if(err) {
		console.log('Database Connection Failed.....');
	}else {
		console.log('Database Connection........');
	}

});
var db = mongoose.connection;

var AnswerSchema = mongoose.Schema({

	questionId: {
		type: String,
		required: true
	},
	question: {
		type: String,
		required: true
	},
	answer: {
		type: String
	},
	userId: {
		type: String,
		required: true
	}

});

var Answer = module.exports = mongoose.model('Answer', AnswerSchema);

module.exports.addAnswer = (newAnswer, callback) => {
	
	newAnswer.save(callback);

}