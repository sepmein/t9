//database meta
var mongoose = require('./db.js').mongoose;

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
var OK = {
	ok: 1
},
	NO = {
		ok: 0
	};

/*-----------------------------------------------------------------*/

var Post = new Schema({
	uid: ObjectId,
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
		star: Number
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


//read
//用户访问主页时返回一个状态码，以及doc或err

var posts = posts || {};

posts.publishPost = function(object, callback) {
	//new P() part could be a problem
	var newPost = new P();
	newPost.author = object.user;
	newPost.content = object.content;
	newPost.uid = object.uid;
	console.dir(newPost);
	newPost.save(function(err) {
		//传递err至服务器
		if (!err) {
			callback(OK);
			console.log('new post saved');
		} else {
			callback(NO, err);
			console.log(err);
		}
	});
}



posts.fetchAll = function(callback) {
	//iss: 'P' keyword could be a problem
	var query = P.find({});
	query.limit(20);
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
posts.newComment = function(id, data, callback) {
	data.date = data.date || Date.now;
	var conditions = {
		//iss: objectid could be a problem
		_id: id
	},
		update = {
			$push: {
				comments: data
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

posts.plus = function(id, callback) {
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

posts.minus = function(id, callback) {
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

posts.star = function(id, callback) {
	var conditions = {
		//iss: objectid could be a problem
		_id: id
	},
		update = {
			$inc: {
				"meta.star": 1
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
exports.posts = posts;
