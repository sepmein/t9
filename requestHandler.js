var STATICPATH = __dirname + '/public';

var mime = require('mime'),
  url = require('url'),
  fs = require('fs'),
  querystring = require('querystring');

function handler(req, res) {

  //simple router
  var pathname = STATICPATH + url.parse(req.url).pathname;

  console.log("request pathname = " + pathname);

  if (pathname === STATICPATH + '/') {

    pathname = STATICPATH + '/index.html';

  }

  var getMime = mime.lookup(pathname);


  //response section
  //get content-length by fs.stat
  fs.stat(pathname, function(err, stat) {
    if (err) {
      console.log(err);
      res.writeHead(404);
      res.end('No Such File error');
      return;
    }

    res.writeHead(200, {
      "content-type": getMime,
      "content-length": stat.size
    });

    fs.readFile(pathname, function(err, data) {
      if (err) {
        throw err;
      }
      res.end(data);

    });

  });

}

exports.handler = handler;
