var express = require('express');
var db = require('../models');
var router = express.Router();

// GET /posts/new - display form for creating new posts
router.get('/', function(_req, res) {
    db.tag.findAll()
    .then(function(tags) {
      res.render('tags/index', { tags: tags });
    })
    .catch(function(error) {
      res.status(400).render('main/404');
    });
  });
  
  // GET /posts/:id - display a specific post and its author
  router.get('/:id', function(req, res) {
    db.tag.find({
      where: { id: req.params.id },
      include: [db.post],
    })
    .then(function(tag) {
      if (!tag) throw Error();
      res.render('tags/show', { tag: tag });
    })
    .catch(function(error) {
      res.status(400).render('main/404');
    });
  });
  
  module.exports = router;