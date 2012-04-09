//database meta
var mongoose = require('.././db.js').mongoose;

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
var OK = {
	ok: 1
},
	NO = {
		ok: 0
	};

/*----------------------------------------------
    store users - lifeTags Connection here
------------------------------------------------*/

var RUsers = new Schema({
	uid: {
		type: ObjectId,
		ref: 'users',
		required: true
	},
	ltid: {
		type: ObjectId,
		ref: 'lifetags',
		required: true
	},
	type: {
		type: String,
		enum: ['participant', 'initiator']
	},
	privacy: {
		type: Number,	
		min: 0,
		max: 5
	},
	importance: {
		type: Number,
		min: 0,
		max: 999
	},
	happiness: {
		type: Number,
		min: -5,
		max: 5
	}
});

var RU = mongoose.model('lifetags.rusers', RUsers);

//wraping object for expose
var RUsers = RUsers || {};

//constructor
RUsers.RU = RU;

//functions
RUsers.add = function(doc, callback) {
	var newRU = new RU();
	newRU.uid = doc.uid;
	newRU.ltid = doc.ltid;
	newRU.type = doc.type;
	newRU.privacy = doc.privacy;
	newRU.importance = doc.importance;
	newRU.happiness = doc.happiness;
	newRU.save(function(err) {
		if (!err) {
			callback(OK);
		} else {
			callback(NO, err);
		}
	});
};

//exports
exports.RUsers = RUsers;
