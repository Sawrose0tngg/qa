var express = require('express');
var router = express.Router();

Question = require('../model/question');
Answer = require('../model/answer');
User = require('../model/user');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('Logged user: '+req.session.email);

	if(req.session.email == undefined || req.session.email == '') {
	    res.redirect('/login');
	    return;
	}

	var questionList = [];
	Question.find((err, questions) => {
		if(err) throw err;
		for(var i=0; i<questions.length; i++) {
			questionList.push(questions[i].question);
		}
		console.log(questionList);
		User.findOne({email:req.session.email}, (err, user) => {
			if(err) throw err;
			if(user.role == "0") {
				res.redirect('/users');
				return;
			}
			res.render('index', 
		  	{ 
		  		title: 'Question | User',
		  		show: 'user',
		  		questions: questions,
		  		loggedUser: user
		  	});
		});
	});	
});

router.post('/addanswer', function(req, res, next) {
	
	if(req.session.email == undefined || req.session.email == '') {
	    res.redirect('/login');
	    return;
	}

	User.findOne({email:req.session.email}, (err, user) => {
		if(err) throw err;
		if(user.role == "0") {
			res.redirect('/users');
			return;
		}
		var totalQuestion = req.body.noQuestion;
		console.log('<><><><><><><><><><><><><><><><><>');
		
		var ans0 = {
			questionId: req.body.questionId0,
			question: req.body.question0,
			answer: req.body.answer0,
			userId: user.email
		};
		var ans1 = {
			questionId: req.body.questionId1,
			question: req.body.question1,
			answer: req.body.answer1,
			userId: user.email
		};
		var ans2 = {
			questionId: req.body.questionId2,
			question: req.body.question2,
			answer: req.body.answer2,
			userId: user.email
		};
		var ans3 = {
			questionId: req.body.questionId3,
			question: req.body.question3,
			answer: req.body.answer3,
			userId: user.email
		};
		var ans4 = {
			questionId: req.body.questionId4,
			question: req.body.question4,
			answer: req.body.answer4,
			userId: user.email
		};
		if(totalQuestion == "6" || totalQuestion == "7" || totalQuestion == "8" || totalQuestion == "9" || totalQuestion == "10") {
			var ans5 = {
				questionId: req.body.questionId5,
				question: req.body.question5,
				answer: req.body.answer5,
				userId: user.email
			};
		}
		if(totalQuestion == "7" || totalQuestion == "8" || totalQuestion == "9" || totalQuestion == "10") {
			var ans6 = {
				questionId: req.body.questionId6,
				question: req.body.question6,
				answer: req.body.answer6,
				userId: user.email
			};
		}
		if(totalQuestion == "8" || totalQuestion == "9" || totalQuestion == "10") {
			var ans7 = {
				questionId: req.body.questionId7,
				question: req.body.question7,
				answer: req.body.answer7,
				userId: user.email
			};
		}
		if(totalQuestion == "9" || totalQuestion == "10") {
			var ans8 = {
				questionId: req.body.questionId8,
				question: req.body.question8,
				answer: req.body.answer8,
				userId: user.email
			};
		}
		if(totalQuestion == "10") {
			var ans9 = {
				questionId: req.body.questionId9,
				question: req.body.question9,
				answer: req.body.answer9,
				userId: user.email
			};
		}
		if(ans5 == undefined) {
			var answerLists = [ans0,ans1,ans2,ans3,ans4];
		}else if(ans6 == undefined) {
			var answerLists = [ans0,ans1,ans2,ans3,ans4,ans5];
		}else if(ans7 == undefined) {
			var answerLists = [ans0,ans1,ans2,ans3,ans4,ans5,ans6];
		}else if(ans8 == undefined) {
			var answerLists = [ans0,ans1,ans2,ans3,ans4,ans5,ans6,ans7];
		}else if(ans9 == undefined) {
			var answerLists = [ans0,ans1,ans2,ans3,ans4,ans5,ans6,ans7,ans8];
		}else {
			var answerLists = [ans0,ans1,ans2,ans3,ans4,ans5,ans6,ans7,ans8,ans9];
		}
		
		console.log(answerLists);
		Answer.collection.insert(answerLists, (err, docs) => {
			if(err) throw err;
			console.log('<<<<<<< INERTED >>>>>>>>');

			res.redirect('/');
		});
	});
	
});


router.get('/login', function(req, res, next) {
	if(req.query.action == 'invalid') {
		res.render('login', 
		{ 
		  	title: 'User | Login',
		  	show: 'error'
		});
	}else if(req.query.action == 'logout'){
		req.session.email = '';
		res.redirect('/login');	
	}else {	
		res.render('login', 
		{ 
		  	title: 'User | Login',
		  	show: 'login'
		});
	}
});


router.post('/login', function(req, res, next) {
  
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({email: email}, (err, user) => {
    if(err) throw err;
    if(user) {
      if(user.password == password) {
      	console.log('User login');
      	console.log(email);
      	req.session.email = email;
      	console.log(req.session.email);
      	res.redirect('/');
      }else {
      	console.log('Password Not Match...');
      	res.redirect('/login?action=invalid');
      }
      
    }else {
      var newUser = [{
        email: email,
        password: password,
        role: "1"
      }];

      User.collection.insert(newUser, (err, docs) => {
        if(err) throw err;
        console.log('<<<<<<< INERTED >>>>>>>>');
        req.session.email = email;
        res.redirect('/');
      }); 
    }

  }); 
});

module.exports = router;
