var db = require('../models');

db.post.find({
    where: { id: 1 },
    include: [db.comment]
  }).then(function(post) {
    // by using eager loading, the post model should have a comments key
    console.log(post.comments);
  });