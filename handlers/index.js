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
    db.users.findById(koki.uid, function(status, doc) {
      if (!status.ok || !doc) {
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
      }
    });
  });
};

handlers.renderApi = function(req, res, next) {
  res.redirect('/api/index.html');
};

handlers.renderLogin = function(req, res, next) {
  res.render('login', {
    layout: false
  });
};

handlers.renderLifeTag = function(req, res, next) {
  res.render('lifeTag', {
    layout: false
  });
};

handlers.login = function(req, res, next) {
  var user = req.body.user;
  var password = req.body.password;
  db.users.authenticate(user, password, function(status, err) {
    if (status.ok) {
      db.users.findByUser(user, function(err, doc) {
        req.session.uid = doc._id;
        req.session.user = user;
        res.redirect('/');
      });
    } else {
      //console.log(err);
      res.redirect('/login');
    }
  });
};

handlers.logout = function(req, res, next) {
  if (req.session.uid) {
    delete req.session.uid;
    delete req.session.user;
  }
  res.redirect('/login');
};

handlers.postPosts = function(req, res) {
  //must use some body parser to parse the post request
  if (req.body) {
    var data = req.body;
    data.uid = req.session.uid;
    data.user = req.session.user || req.body.user;
    console.log(data);
    db.posts.publishPost(data, function(status, err) {
      if (status.ok) {
        //publish ok
        console.log('发布成功！');
      } else {
        //publish not ok,还是要想到一定办法通知客户端啊~
        //res.flash('err',err);
      }
    });
  } else {
    //res.flash('err','没发布什么内容啊。');
  }
};

handlers.postComment = function(req, res) {
  if (req.body.content && req.body.pid) {
    var data = req.body;
    data.uid = req.session.uid;
    data.author = req.session.user || req.body.user;
    db.posts.newComment(req.body.pid, data, function(status, data) {
      if (status.ok) {
        //sth
      } else {
        //on err
        console.log(data);
      }
    });

  } else {
    console.log('no content or pid');
  }
};

//move this part to template engine, reduce ajax call
handlers.getServerInfo = function(req, res) {
  var info = {
    upTime: process.uptime(),
    memory: process.memoryUsage().rss
  };
  res.send(info);
};

//replaced by new coupon system
handlers.register = function(req, res) {
  console.log('register called req.body' + req.body.user + ',' + req.body.password);
  db.users.register(req.body.user, req.body.password, function(status, data) {
    if (status.ok) {
      db.users.findByUser(req.body.user, function(status, doc) {
        req.session.uid = doc._id;
        req.session.user = req.body.user;
        res.redirect('/');
      });
    } else {
      res.redirect('/login');
    }
  });
};

handlers.getUsers = function(req, res) {
  db.users.all(function(status, data) {
    if (status.ok) {
      res.send(data);
    } else {

    }
  });
};

handlers.postLifeTags = function(req, res) {
  /*-----------------------------------
    将此部分逻辑移至客户端，服务器端负责处理和验证纯净数据
    -------------------------------------*/
    console.dir(req.body);
  //format data
  var data = req.body;
  //权宜之计，不能满足多种条件，将来改进
  data.users = [];
  data.users[0] = {
    uid: req.session.uid,
    type: req.body.type,
    privacy: req.body.privacy,
    importance: req.body.importance,
    happiness: req.body.happiness
  };
  delete data.type;
  delete data.privacy;
  delete data.importance;
  delete data.happiness;
  console.dir(data);
  db.lifeTags.add(data, function(status, doc) {
    if (status.ok) {
      //for debug
      console.log('[new] lifeTag Saved');
    } else {
      //on err
      console.log(doc);
    }
  });
};

handlers.getComments = function(res, req, next) {};

handlers.getPosts = function(req, res) {
  db.posts.fetchAll(function(status, info){
    if(status.ok){
      res.json(info);
    } else {
      next(info);
    }
  });
};

handlers.fourOFour = function(req, res) {
  res.redirect('404.html');
};

//coupon section
var coupon = require('./coupon.js');
handlers.requireCoupon = coupon.requireCoupon;
handlers.welcome = coupon.welcome;

//vector 
var vector = require('./vector.js');
handlers.renderVector = vector.renderVector;
handlers.interpretor = vector.interpretor;

module.exports = handlers;
