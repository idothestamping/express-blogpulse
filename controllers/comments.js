var express = require('express');
var db = require('../models');
var router = express.Router();

router.post('/', function(req, res) {
    db.comment.create({
      name: req.body.name,
      content: req.body.content,
      postId: req.body.postId
    })
          .then(function(author) {
            res.redirect('/posts/:id');
          })
          .catch(function(error) {
            res.status(400).render('main/404');
          });
  });

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
    include: [db.author]
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