//status code
var OK = {
	ok: 1
},
	NO = {
		ok: 0
	};

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/kokiya');

var Post = new Schema({
	author: String,
	content: String,
	date: {
		type: Date,
	default:
		Date.now
	},
	meta: {
		plus: Number,
		minus: Number,
		favs: Number
	},
	comments: [Comment]
});

var Comment = new Schema({
	author: String,
	content: String,
	date: {
		type: Date,
	default:
		Date.now
	}
});

var P = mongoose.model('posts', Post);

//create
//publish a new post, execute a callback to retrieve status
//mark proto later
function publishPost(object, callback) {
	//new P() part could be a problem
	var newPost = new P();
	newPost.author = object.author;
	newPost.content = object.content;
	newPost.save(function(err) {
		//传递err至服务器
		if (!err) {
			callback(OK);
		} else {
			callback(NO, err);
		}
	});
}

//read
//用户访问主页时返回一个状态码，以及doc或err


function Posts() {

}

Posts.prototype.fetchAll = function(callback) {
	//iss: 'P' keyword could be a problem
	var query = P.find({});
	query.limit(50);
	query.desc('date');
	query.run(function(err, doc) {
		if (!err) {
			callback(OK, doc);
		} else {
			callback(NO, err);
		}
	});
};

//update
//update comments
Posts.prototype.newComment = function(id, data, callback) {
	var conditions = {
		//iss: objectid could be a problem
		_id: id
	},
		update = {
			$push: {
				comments: data
			}
		},
		options = {}
		;
	P.update(conditions, update, options, function(err, numAffected) {
		if (!err) {
			callback(OK, numAffected);
		} else {
			callback(NO, err);
		}
	});
};

Posts.prototype.plus = function(id, callback) {
	var conditions = {
		//iss: objectid could be a problem
		_id: id
	},
		update = {
			$inc: {
				"meta.plus": 1
			}
		},
		options = {};

	P.update(conditions, update, options, function(err, numAffected) {
		if (!err) {
			callback(OK, numAffected);
		} else {
			callback(NO, err);
		}
	});
};

Posts.prototype.minus = function(id, callback) {
	var conditions = {
		//iss: objectid could be a problem
		_id: id
	},
		update = {
			$inc: {
				"meta.minus": 1
			}
		},
		options = {};
	P.update(conditions, update, options, function(err, numAffected) {
		if (!err) {
			callback(OK, numAffected);
		} else {
			callback(NO, err);
		}
	});
};

Posts.prototype.favs = function(id, callback) {
	var conditions = {
		//iss: objectid could be a problem
		_id: id
	},
		update = {
			$inc: {
				"meta.favs": 1
			}
		},
		options = {};
	P.update(conditions, update, options, function(err, numAffected) {
		if (!err) {
			callback(OK, numAffected);
		} else {
			callback(NO, err);
		}
	});
};

//delete
//exports to outer modules
var posts = new Posts();
exports.posts = posts;
exports.publishPost = publishPost;
