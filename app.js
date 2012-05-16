/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes');

/*database modules*/
var db = db || {};
db.posts = require('./data/posts.js').posts;
db.users = require('./data/users.js').users;
db.lifeTags = require('./data/lifetags').lifeTags;

/*middleware*/
var middleware = require('./middleware');

/*mongoose session store by mongoose session, maybe rewrite it by myself later*/
var SessionMongoose = require("session-mongoose");
var sessionStore = new SessionMongoose({
  url: "mongodb://localhost/session",
  interval: 60000 * 60 * 24 * 30 * 6
});

var app = module.exports = express.createServer();

// Configuration
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'Crimson~87',
    store: sessionStore,
    cookie: {
      maxAge: 60000 * 60 * 24 * 30 * 6
    }
  }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});
app.listen(8000);

// Routes
app.get('/', middleware.requireLogin, routes.index);

app.get('/login', function(req, res) {
  if (req.session.uid) {
    res.redirect('/');
  } else {
    res.render('login', {
      layout: false
    });
  }
});

app.get('/api', function(req, res) {
  res.redirect('/api/index.html');
});

app.post('/login', function(req, res) {
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
});

app.get('/logout', function(req, res) {
  if (req.session.uid) {
    delete req.session.uid;
    delete req.session.user;
  }
  res.redirect('/login');
});

app.get('/lifetag', middleware.requireLogin, function(req, res) {
  res.render('lifeTag', {
    layout: false
  });
});

app.post('/requireCoupon', function(req, res) {
  var email = req.body.email;

});
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// Rest Api
app.get('/api/posts', function(req, res) {
  db.posts.fetchAll(function(status, data) {
    if (status.ok) {
      res.send(data);
    }
  });
});

app.post('/api/posts', middleware.requireLogin, function(req, res) {
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
});

app.get('/api/posts/comment', function() {});

app.post('/api/posts/comment', middleware.requireLogin, function(req, res) {
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
});

//move this part to template engine, reduce ajax call
app.get('/api/serverInfo', function(req, res) {
  var info = {
    upTime: process.uptime(),
    memory: process.memoryUsage().rss
  };
  res.send(info);
});

/*rest api users*/
app.get('/api/users', function(req, res) {
  db.users.all(function(status, data) {
    if (status.ok) {
      res.send(data);
    } else {

    }
  });
});

//注册成功。。。不成功redirect。。以后优化，尽量在一个页面当中完成注册过程
app.post('/register', function(req, res) {
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
});

//lifetags
app.post('/api/lifetags', function(req, res) {
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
});

//websocket
//保留代码，去除功能
/*
io.sockets.on('connection', function(socket) {

  var queryT = socket.handshake.query.t;

    //login
  socket.on('login', function(requestAuthorName) {

    var notUsing = authors.every(function(element, index, array) {
      return (element.authorName !== requestAuthorName);
    });
    if (notUsing) {
      authors.push({
        authorName: requestAuthorName,
        queryT: queryT
      });
      socket.emit('loginSuccess');
    } else {
      socket.emit('loginFailure', {
        err: "用户名正被使用."
      });
    }
  });

  //say sth
  socket.on('say', function(data) {
    //mark proto later
    db.posts.publishPost(data, callback);

    function callback(status, err) {
      if (status.ok) {
        socket.emit('newMessage', data);
        socket.broadcast.emit('newMessage', data);
      } else {
        //err handler
        console.log(err);
      }
    }
  });

  //comment on post
  socket.on('comment', function(id, data) {
    db.posts.newComment(req.body.pid,data,function(status,data){
  
    })(id, data, callback);;

    function callback(status, docs) {
      if (status.ok) {
        console.log(docs);
      } else {

      }
    }
  });

  //meta
  socket.on('plus', function(id) {
    db.posts.plus(id, callback);

    function callback(status, docs) {
      if (status.ok) {
        console.log(docs);
      } else {

      }
    }
  });
  socket.on('minus', function(id) {
    db.posts.minus(id, callback);

    function callback(status, docs) {
      if (status.ok) {
        console.log(docs);
      } else {

      }
    }
  });
  socket.on('star', function(id) {
    db.posts.star(id, callback);

    function callback(status, docs) {
      if (status.ok) {
        console.log(docs);
      } else {

      }
    }
  });

});
*/
