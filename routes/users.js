var express = require('express');
var router = express.Router();

Question = require('../model/question');
Answer = require('../model/answer');
User = require('../model/user');

/* GET users listing. */
router.get('/', function(req, res, next) {

  if(req.session.email == undefined || req.session.email == '') {
      res.redirect('/login');
      return;
  }

  if(req.query.action == 'delete') {
    Question.findOneAndRemove({_id:req.query.questionId}, (err) => {
      if(err) throw err;
      res.redirect('/users');
      console.log('Delete Success>>>>>>>>>>>>>>>>>.');
    });
  }else {
    Question.find(function(err, question) {
        if(err) throw err;

        User.findOne({email:req.session.email}, (err, user) => {
          if(err) throw err;
          if(user.role == "1") {
            res.redirect('/');
            return;
          }
          res.render('index', 
          { 
            title: 'Question | Admin',
            show: 'admin',
            questionList: question,
            loggedUser: user
          });
        });
    });
  }
});

router.get('/answer', function(req, res, next) {
  
  if(req.session.email == undefined || req.session.email == '') {
      res.redirect('/login');
      return;
  }

  if(req.query.action == 'delete') {
    Answer.findOneAndRemove({_id:req.query.answerId}, (err) => {
      if(err) throw err;
      res.redirect('/users/answer');
      console.log('Delete Success>>>>>>>>>>>>>>>>>.');
    });
  }else {
    Answer.find(function(err, answer) {
        if(err) throw err;
        User.findOne({email:req.session.email}, (err, user) => {
          if(err) throw err;
          if(user.role == "1") {
            res.redirect('/');
            return;
          }
          res.render('index', 
          { 
            title: 'Question | Admin',
            show: 'answer',
            answerList: answer,
            loggedUser: user
          });
        });  
    });
  }
});

router.get('/add_question', function(req, res, next) {

  if(req.session.email == undefined || req.session.email == '') {
      res.redirect('/login');
      return;
  }
  User.findOne({email:req.session.email}, (err, user) => {
    if(err) throw err;
    if(user.role == "1") {
      res.redirect('/');
      return;
    }
    res.render('index', 
    	{ 
    		title: 'Question | Admin',
    		show: 'addquestion',
        loggedUser: user 
    	});
  });  
});

router.post('/add_question', function(req, res, next) {
  
  if(req.session.email == undefined || req.session.email == '') {
      res.redirect('/login');
      return;
  }

  console.log(req.body.question);
  var que = new Question({
    question: req.body.question
  });

  Question.addQuestion(que, (err, question) => {
    if(err) throw err;
    console.log('Question Added>>>>>>>>>>>>>>>>>>>>');
    res.redirect('/users');
  });
});

router.get('/edit_question', function(req, res, next) {

  if(req.session.email == undefined || req.session.email == '') {
      res.redirect('/login');
      return;
  }

  var id = req.query.questionId;
    Question.findOne({_id:id}, (err, question) => {
      if(err) throw err;
      User.findOne({email:req.session.email}, (err, user) => {
          if(err) throw err;
          if(user.role == "1") {
            res.redirect('/');
            return;
          }
          res.render('index', 
          { 
            title: 'Question | Admin',
            show: 'editquestion',
            question: question,
            loggedUser: user
          });
      });
    });
});

router.post('/edit_question', function(req, res, next) {

  if(req.session.email == undefined || req.session.email == '') {
      res.redirect('/login');
      return;
  }

  var id = req.query.questionId;
  var query = {_id:id};

  Question.findByIdAndUpdate(query, {question:req.body.question}, (err, question) => {
    if(err) throw err;
    res.redirect('/users');
    console.log('Success Update >>>>>>>>>>>>>');
  });
});


module.exports = router;
