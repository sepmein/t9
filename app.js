/**
 * Module dependencies.
 */




var express = require('express'),
  routes = require('./routes');

/*database modules*/
var db = db || {};
db.posts = require('./data/posts.js').posts;
db.users = require('./data/users.js').users;

/*middleware*/
var middleware = require('./middleware').middleware;

/*mongoose session store by mongoose session, maybe rewrite it by myself later*/
var SessionMongoose = require("session-mongoose");
var sessionStore = new SessionMongoose({
    url: "mongodb://localhost/session",
    interval: 60000*60*24*30*6
});

var app = module.exports = express.createServer(),
  io = require('socket.io').listen(app);

io.configure('production', function() {
  io.enable('browser client minification'); // send minified client
  io.enable('browser client etag'); // apply etag caching logic based on version number
  io.enable('browser client gzip'); // gzip the file
  io.set('log level', 1); // reduce logging
});

//data section store data in the memory
var authors = [];

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
    cookie: {maxAge: 60000*60*24*30*6}
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
app.listen(3000);

// Routes
app.get('/', middleware.requireLogin, routes.index);
app.get('/login', function(req,res){
  res.render('/login');
});
app.get('/api',function(req,res){
  res.redirect('/api/index.html');
});
app.post('/login', function(req, res) {
  var user = req.body.user;
  var password = req.body.password;
  db.users.authenticate(user, password, function(status, err) {
    if (status.ok) {
      req.session.user = user;
      res.redirect('/index.html');
    } else {
      //console.log(err);
      res.redirect('/');
    }
  });
});
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// Rest Api
app.get('/api/posts', function(req, res) {
  db.posts.fetchAll(function(status, data) {
    if (status.ok) {
      console.dir(data);
      res.send(data);
    }
  });
});

app.post('/api/posts', function(req, res) {
  //must use some body parser to parse the post request
  db.posts.publishPost(req.body);
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
      res.redirect('/index.html');
    } else {
      res.redirect('/');
    }
  });
});

//websocket
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
    db.posts.newComment(id, data, callback);

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

  socket.on('disconnect', function() {
    authors.forEach(function(element, index, array) {
      if (element.queryT === queryT) {
        //delete and log off
        array.splice(index, 1);
      }
    });
    console.log(authors);
  });

});
