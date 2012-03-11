var handler = require('./requestHandler').handler,
    app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    //data processor
    db = require('./data/crud');

io.configure('production',function(){
  io.enable('browser client minification');  // send minified client
  io.enable('browser client etag');          // apply etag caching logic based on version number
  io.enable('browser client gzip');          // gzip the file
  io.set('log level', 1);                    // reduce logging
});

//data section store data in the memory
var messages = [],
    users = [],
    MAX = 20;

app.listen(80);

//very crude error handler
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

//websocket
io.sockets.on('connection', function(socket) {

  var queryT = socket.handshake.query.t;


  //new to website fetch all messages
  //use mongodb to store & get data!!
  db.findAllPosts(initiate);
  function initiate(data){
    socket.emit('newComer',data);
  }

  //emit server running time event
  socket.emit('serverInfo', {
    upTime : process.uptime(),
    memory : process.memoryUsage().rss
  });

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

  socket.on('say', function(data) {
    //console.log(data);
    /*if (messages.length === MAX) {
      messages.shift();    
    }
    messages.push(data);*/

    //schema and validator
    var post = new db.Post(data.user,data.content);
    //save to db
    db.insert(post);

    //planning to inject into client side
    socket.emit('newMessage',post);

    socket.broadcast.emit('newMessage',post);
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
