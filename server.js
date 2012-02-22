//read file from disk
//static servers
//now just response the index.js file to the request


var http = require('http');
var fs = require('fs');
var url = require('url');


//	console.log(__dirname);
//var requestUrl = url.parse(request.url).pathname
//var filepath = __dirname + requestUrl;

//	console.log(filepath);

fs.stat(__dirname + '/server.js',function(err, stat){
	if (err) {
		throw err;
	}

	http.createServer(function(request , response){

		response.writeHead(200,{
			'content-type' : 'text/plain' , 
			'content-length' : stat.size
		});

		console.log(stat.size);

		var data = fs.readFile(__dirname + '/server.js',function(err, data){

			response.end(data);

		});

	}).listen(80);

});