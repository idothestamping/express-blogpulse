var async = require('async');
var express = require('express');
var db = require('../models');
var router = express.Router();

// POST /posts - create a new post
router.post('/', function(req, res) {
  // Turn the 'tags' into an array
  var tags = [];
  if(req.body.tags){
    tags = req.body.tags.split(",");
    // tags = tags.filter(function(t){ return.t.trim() != ""; }) // remove all white space, version 1
  }
  db.post.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then(function(post) {
    // If I have tags, I want to findOrCreatej
    async.forEach(tags, function(t, done){
      db.tag.findOrCreate({
        where: { content: t.trim() } // remove all white space version 2
      })
      .spread(function(newTag, wasCreated){
        post.addTag(newTag)
        .then(function(){
          done();
        })
        .catch(done);
      })
      .catch(done);
    }, function(){
      res.redirect('/posts/' + post.id); // Go to created post's show page
    });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

// GET /posts/new - display form for creating new posts
router.get('/new', function(req, res) {
  db.author.findAll()
  .then(function(authors) {
    res.render('posts/new', { authors: authors });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

// GET /posts/:id - display a specific post and its author
router.get('/:id', function(req, res) {
  db.post.find({
    where: { id: req.params.id },
    include: [db.author, db.comment, db.tag],
  })
  .then(function(post) {
    if (!post) throw Error();
    res.render('posts/show', { post: post });
  })
  .catch(function(error) {
    res.status(400).render('main/404');
  });
});

module.exports = router;
