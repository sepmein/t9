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

var LifeTag = new Schema({
	title: {
		type: String,
		required: true,
		trim: true
	},
	content: String,
	date: Date,
	location: {
		x: Number,
		y: Number
	},
	tags: [Tag],
	users: [User]
});

var Tag = new Schema({
	tag: String
});

var User = new Schema({
	uid: ObjectId,
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

var L = mongoose.model('lifeTags', LifeTag);

var lifeTags = lifeTags || {};

lifeTags.add = function(object, callback) {
	var newTag = new L();
	newTag.title = object.title;
	newTag.content = object.content;
	newTag.date = object.date;
	newTag.
}
