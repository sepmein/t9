var OK = {
	ok: 1
},
	NO = {
		ok: 0
	};
//require
var lt = require('./lifeTags').lifeTags;
var RUsers = require('./RUsers').RUsers;
//constructor
var L = lt.L;
var RU = RUsers.RU;

var lifeTags = lifeTags || {};

//functions
//adding data structure
/*
data = {
	title,
	content,
	date,
	location,
	tags,
	users:[
		{
			uid,
			ltid,
			type,
			privacy,
			importance,
			happiness	
		},......
	]
}
*/

lifeTags.add = function(doc, callback) {
	lt.add(doc, function(status, data) {
		if (status.ok) {
			//if no err, save relationships
			for (var i = doc.users.length - 1; i >= 0; i--) {
				doc.users[i].ltid = data;
				RUsers.add(doc.users[i], function(err) {
					if (!err) {
						callback(OK);
					} else {
						callback(NO, err);
					}
				});
			};
		} else {
			callback(NO, data);
		}
	});
};

lifeTags.getByUID = function(uid, callback) {
	var query = RU.find({
		uid: uid
	});
	query.populate('ltid');
	query.run(function(err, docs) {
		if (!err) {
			console.dir(docs);
		} else {
			console.error(err);
		}
	});
};

lifeTags.getByLTID = function(ltid, callback) {
	var query = RU.find({
		ltid: ltid
	});
	query.populate('uid');
	query.run(function(err, docs) {
		if (!err) {
			console.dir(docs);
		} else {
			console.error(err);
		}
	});
};

exports.lifeTags = lifeTags;
