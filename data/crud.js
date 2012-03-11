//define schema for mongodb
var Post = function(user,content){
	this.user = user;
	this.message = {
		timeStamp : new Date(),
		content : content,
		comments : []
	};
}



//连接至mongodb
var db = require('mongojs').connect('kokiya'),
	posts = db.collection('posts'),
	users = db.collection('users');

//返回按日期排列的最后20条信息
function findAllPosts(emit){
	posts.find().limit(20).sort({ "message.timeStamp" : -1},function(err,data){
		emit(data);
	});
}


function insert(data){
	posts.insert(data,function(err,data){
		if (err) console.error(err);
	});
}

exports.findAllPosts = findAllPosts;
exports.insert = insert;
exports.Post = Post;