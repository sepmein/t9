/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  db = require('./data/db');

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
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'Crimson~87'
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

// Routes
app.get('/', function(req, res) {
  //重定向的方法很烂，将来换掉
  res.redirect('/index.html');
});

app.listen(3000);
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
  db.publishPost(req.body);
});

//move this part to template engine, reduce ajax call
app.get('/serverInfo', function(req, res) {
  var info = {
    upTime: process.uptime(),
    memory: process.memoryUsage().rss
  };
  res.send(info);
});

//websocket
io.sockets.on('connection', function(socket) {

  var queryT = socket.handshake.query.t;

/*============================================
*将此部分功能移至rest
*==============================================
*/
/*  //new to website fetch all messages
  //use mongodb to store & get data!!
  db.posts.fetchAll(init);

  function init(status, docs) {
    if (status.ok) {
      socket.emit('newComer', docs);
    } else {
      //增加点err处理措施，稍后
      socket.emit('newComer', docs);
    }
  }

  //emit server running time event
  socket.emit('serverInfo', {
    upTime: process.uptime(),
    memory: process.memoryUsage().rss
  });*/

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
    db.publishPost(data, callback);

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
  socket.on('favs', function(id) {
    db.posts.favs(id, callback);

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
