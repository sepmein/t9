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

var User = new Schema({
	user: String,
	password: String
});

var U = mongoose.model('users', User);

//wrap it in super users
var users = users || {};

users.all = function(callback) {
	var query = U.find({}, {
		'user': 1
	});
	query.run(function(err, docs) {
		if (!err) {
			callback(OK, docs);
		} else {
			callback(NO, err);
		}
	});
};

users.register = function(user, password, callback) {
	var query = U.find({
		'user': user
	});
	query.run(function(err, docs) {
		//lack of err handler, add it later
		if (docs.length > 0) {
			//console.dir(docs);
			//console.log('docs found');
			callback(NO, 'User Name has been taken');
		} else {
			var newuser = new U();
			newuser.user = user;
			newuser.password = password;
			newuser.save(function(err) {
				if (err) {
					callback(NO, err);
				} else {
					callback(OK);
				}
			});
		}
	});
};

users.authenticate = function(user, password, callback) {
	var query = U.findOne({
		'user': user
	});
	query.run(function(err, docs) {
		if (err) {
			callback(NO, err);
		} else if (!docs) {
			callback(NO, '用户不存在');
		} else if ((docs.user === user) && (docs.password === password)) {
			callback(OK);
		} else {
			callback(NO, '密码错误');
		}
	});

};

users.findById = function(id, callback) {
	var query = U.findOne({
		_id: id
	}, {
		user: 1
	});
	query.run(function(err, doc) {
		if (err) {
			callback(NO, err);
		} else if (!doc) {
			callback(NO, '用户不存在');
		} else {
			callback(OK, doc);
		}
	});
};
users.findByUser = function(user, callback) {
	var query = U.findOne({
		user: user
	}, {
		_id: 1
	});
	query.run(function(err, doc) {
		if (err) {
			callback(NO, err);
		} else if (!doc) {
			callback(NO, '用户不存在');
		} else {
			callback(OK, doc);
		}
	});
};

exports.users = users;
