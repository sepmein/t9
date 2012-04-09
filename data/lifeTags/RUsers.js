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

//Add Collections for reference
var U = require('.././users').users.U;
var L = require('./index.js').lifeTags.L;


/*----------------------------------------------
    store users - lifeTags Connection here
------------------------------------------------*/

var RUsers = new Schema({
	uid: {
		type: ObjectId,
		ref: U,
		required: true
	},
	ltid: {
		type: ObjectId,
		ref: L
		required: true
	},
	type: {
		type: String,
		enum: ['participant', 'initiator']
	},
	privacy: {
		type: Number
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

var RU = mongoose.Model('lifetags.rusers', RUsers);

//wraping object for expose
var RUsers = RUsers || {};

//constructor
RUsers.RU = RU;

//functions
RUsers.add = function(uid, ltid, doc, callback) {
	var new = new RU();
	new.uid = uid;
	new.ltid = ltid;
	new.type = doc.type;
	new.privacy = doc.privacy;
	new.importance = doc.importance;
	new.happiness = doc.happiness;
	new.save(function(err) {
		if (!err) {
			callback(OK);
		} else {
			callback(NO, err);
		}
	});
};

//exports
exports.RUsers = RUsers;
