var STATICPATH = __dirname + '/public';
var mime = require('mime');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');

var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app);

io.configure('production',function(){
  io.enable('browser client minification');  // send minified client
  io.enable('browser client etag');          // apply etag caching logic based on version number
  io.enable('browser client gzip');          // gzip the file
  io.set('log level', 1);                    // reduce logging
  io.set('transports', [                     // enable all transports (optional if you want flashsocket)
      'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
  ]);
});



var messages = [];
var MAX = 20;

app.listen(46645);

function handler(req,res){

  //simple router

    var pathname = STATICPATH + url.parse(req.url).pathname;

    console.log("request pathname = " + pathname);

    if (pathname === STATICPATH + '/') {

      pathname = STATICPATH + '/index.html';

    }

    var getMime = mime.lookup(pathname);


  //response section

  //get content-length by fs.stat
    fs.stat(pathname,function(err,stat){
      if(err){
        console.log(err);
        res.writeHead(404);
        res.end('No Such File error');
        return;
      }

      res.writeHead(200,{
        "content-type" : getMime,
        "content-length" : stat.size
      });

      fs.readFile(pathname,function(err,data){
        if(err){
          throw err;
        }
        res.end(data);

      });

    });

}

io.sockets.on('connection', function (socket) {

  socket.emit('newComer', messages );

  socket.on('say', function (data) {
    console.log(data);
    if (messages.length === MAX) {
      messages.shift();    
    }
    messages.push(data);

    socket.emit('newMessage',messages[messages.length-1]);
    socket.broadcast.emit('newMessage',messages[messages.length-1]);
  });
});
