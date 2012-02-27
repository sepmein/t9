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

var messages = [],
    users = [],
    MAX = 20;

app.listen(80);

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



//websocket
io.sockets.on('connection', function(socket) {

  var queryT = socket.handshake.query.t;


  //new to website fetch all messages
  socket.emit('newComer', messages );

  //login
  socket.on('login', function(requestUserName){
    
    var notUsing = users.every(function(element,index,array){
      return(element.userName !== requestUserName);
    });
    if(notUsing) {
      users.push({userName  : requestUserName,
                  queryT    : queryT});
      socket.emit('loginSuccess');
    } else {
      socket.emit('loginFailure',{err:"User Name has been taken."});
    }
  });

  socket.on('say', function (data) {
    console.log(data);
    if (messages.length === MAX) {
      messages.shift();    
    }
    messages.push(data);

    //planning to inject into client side
    socket.emit('newMessage',messages[messages.length-1]);

    socket.broadcast.emit('newMessage',messages[messages.length-1]);
  });

  socket.on('disconnect',function(){
    users.forEach(function(element,index,array){
      if(element.queryT === queryT) {
        //delete and log off
        array.splice(index,1);
      }
    });
    console.log(users);
  });


});
