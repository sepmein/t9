var db = db || {};
db.posts = require('.././data/posts.js').posts;
db.users = require('.././data/users.js').users;

function renderById(uid,callback) {
  /*
    returning object structure for rendering user specific index
    {
      uid   : id,
      user  : username,
      posts : [posts],
      serverInfo : {
        upTime : Number,
        memory : Number
      }
    }
  */

  var koki = {};
  koki.uid = uid;
  koki.serverInfo = {
    upTime: process.uptime(),
    memory: process.memoryUsage().rss
  };

  db.posts.fetchAll(function(err, doc) {
    koki.posts = doc;
    db.users.findById(uid, function(status, doc) {
      if(!status.ok) {
        console.dir(doc);
      } else {
        koki.user = doc.user;
        //after a longlong chain of callback, s'll be returned
        //这种callback套callback的模式以后优化。但是目前没有办法。
        callback(koki);
      }
    });
  });
}

exports.renderById = renderById;
