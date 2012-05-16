var db = db || {};
db.posts = require('.././data/posts.js').posts;
db.users = require('.././data/users.js').users;

//core object
var handlers = handlers || {};

handlers.renderIndex = function(req, res, next) {
  var koki = {};
  koki.uid = req.session.uid;
  koki.serverInfo = {
    upTime: process.uptime(),
    memory: process.memoryUsage().rss
  };

  db.posts.fetchAll(function(err, doc) {
    koki.posts = doc;
    db.users.findById(uid, function(status, doc) {
      if (!status.ok) {
        //error handler
      } else {
        koki.user = doc.user;
        //after a longlong chain of callback, s'll be returned
        //这种callback套callback的模式以后优化。但是目前没有办法。
        res.render('index', {
          locals: {
            data: koki
          }
        });
      });
    }
  });
};

handlers.renderApi = function(req, res next) {
  res.redirect('/api/index.html');
};

module.exports = handlers;
