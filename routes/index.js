var mongoose = require('mongoose');

var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'}); // same SECRET as in models/User.js

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');


var express = require('express');
var router = express.Router();




// GET the home page
router.get('/', function(req, res, next) {
  res.render('index');
});


// GET the posts
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});


// POST (create) a new post
router.post('/posts', auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});


// Pre-loading a 'post' object
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('The post you requested could not be found')); }

    req.post = post;
    return next();
  });
});


// Pre-loading a 'comment' object
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('The comment you requested could not be found')); }

    req.comment = comment;
    return next();
  });
});


// GET a post
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});


// DELETE a post, TO DO: only author can delete server side
router.delete('/posts/:post', function(req, res, next) {

    Post.findOne({ _id: req.params.post}, function (err, post) {
      if (err) {res.send(err);}

      post.remove(function (err) {
        if (err) {res.send(err);}
        
        res.json({ message: 'Successfully deleted' });
      });
    });
});



// PUT an upvote to a post
router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(req.body.voter, req.body.userVoteId, function(err, post){
    if (err) { return next(err); }
   
    res.json(post);
  });
});

// PUT a downvote to a post
router.put('/posts/:post/downvote', auth, function(req, res, next) {
  req.post.downvote(req.body.voter, req.body.userVoteId, function(err, post){
    if (err) { return next(err); }
   
    res.json(post);
  });
});


// POST (create) a comment
router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});



// DELETE a comment, TO DO: only author can delete server side
router.delete('/posts/:post/comments/:comment', function(req, res, next) {

    Comment.findOne({ _id: req.params.comment}, function (err, comment) {
      if (err) {res.send(err);}

      comment.remove(function (err) {
        if (err) {res.send(err);}
        
        res.json({ message: 'Successfully deleted' });
      });
    });
});


// PUT an upvote to a comment
router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(req.body.voter, req.body.userVoteId, function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});


// PUT a downvote to a comment
router.put('/posts/:post/comments/:comment/downvote', auth, function(req, res, next) {
  req.comment.downvote(req.body.voter, req.body.userVoteId, function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});




// POST (register) a new user
router.post('/register', function(req, res, next){
  var errorMessage = {}, errorDetected = false;

  if(!req.body.username || req.body.username.length < 5 || req.body.username.length > 15){
    errorMessage.username = 'The username must be 5-15 characters long.';
    errorDetected = true;
  }
  if(!req.body.password || req.body.password.length < 5 || req.body.password.length > 15){
    errorMessage.password = 'The password must be 5-15 characters long.';
    errorDetected = true;
  }
  if (errorDetected) {
    return res.status(400).json(errorMessage);
  }
   

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return res.status(400).json(err); }

    return res.json({token: user.generateJWT()})
  });
});


// POST (login) a user
router.post('/login', function(req, res, next){
  var errorMessage = {}, errorDetected = false;

  if(!req.body.username){
    errorMessage.username = 'Enter your username.';
    errorDetected = true;
  }
  if(!req.body.password){
    errorMessage.password = 'Enter your password.';
    errorDetected = true;
  }
  if (errorDetected) {
    return res.status(400).json(errorMessage);
  }


  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});


module.exports = router;