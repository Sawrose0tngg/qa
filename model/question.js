var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/qa', function(err) {
	if(err) {
		console.log('Database Connection Failed.....');
	}else {
		console.log('Database Connection........');
	}

});
var db = mongoose.connection;

var QuestionSchema = mongoose.Schema({

	question: {
		type: String,
		required: true
	}

});

var Question = module.exports = mongoose.model('Question', QuestionSchema);

module.exports.getAllQuestion = function(callback) {
	Question.find(callback);
}

module.exports.addQuestion = (newQuestion, callback) => {
	
	newQuestion.save(callback);

}