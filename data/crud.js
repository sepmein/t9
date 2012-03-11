//define schema for mongodb
var Post = function(user,content){
	this.user = user;
	this.message = {
		timeStamp : new Date(),
		content : content
	};
}

//连接至mongodb
var db = require('mongojs').connect('kokiya'),
	posts = db.collection('posts'),
	users = db.collection('users');



function findAllPosts(emit){
	posts.find(function(err,data){
		func(data);
	});
}


function post(data){
	posts.insert(data,function(err,data){
		if (err) console.error(err);
	});
}

exports.findAllPosts = findAllPosts;
exports.post = post;