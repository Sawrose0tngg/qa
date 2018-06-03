var express = require('express');
var router = express.Router();
var fs = require('fs');
var csv = require('fast-csv');
var ws = fs.createWriteStream('answer.csv');

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
    });
  }else {
    Question.find(function(err, question) {
        if(err) throw err;

        User.findOne({email:req.session.email}, (err, user) => {
          if(err) throw err;
          try {
            if(user.role == "1") {
              res.redirect('/');
              return;
            }
            console.log(user);
            res.render('index', 
            { 
              title: 'Question | Admin',
              show: 'admin',
              questionList: question,
              loggedUser: user.email,
              role: "0"
            });
          }catch(ex) {
            res.redirect('/');
          }
          
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
            loggedUser: user.email,
            role: "0"
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
        loggedUser: user.email,
        role: "0"
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
            loggedUser: user.email,
            role: "0"
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

router.get('/export_csv', function(req, res, next) {

  if(req.session.email == undefined || req.session.email == '') {
      res.redirect('/login');
      return;
  }

  Answer.find(function(err, answer) {
        if(err) throw err;
        User.findOne({email:req.session.email}, (err, user) => {
          if(err) throw err;
          if(user.role == "1") {
            res.redirect('/');
            return;
          }
          for(var i=0; i<answer.length; i++) {
            csv.write([
                ['ID', 'Question', 'Answer', 'User'],
                [i+1, answer[i].question, answer[i].answer, answer[i].userId]
              ], {headers:true}).pipe(ws);
            console.log('THIS IS MY ANSWER LENGTH: '+answer[i].question);  
          }
          
          res.redirect('/users');
        });  
  }); 
  
});


module.exports = router;
