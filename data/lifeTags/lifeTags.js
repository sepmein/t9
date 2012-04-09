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
	tags: [Tag]
});

var Tag = new Schema({
	tag: String
});

var L = mongoose.model('lifetags', LifeTag);

var lifeTags = lifeTags || {};

lifeTags.L = lifeTags.L || L;

lifeTags.add = function(object, callback) {
	var newTag = new L();
	newTag.title = object.title;
	newTag.content = object.content;
	newTag.date = object.date;
	newTag.location = object.location;
	newTag.tags = object.tags;
	newTag.save(function(err) {
		if (!err) {
			callback(OK);
		} else {
			callback(NO, err);
		}
	});
};


exports.lifeTags = lifeTags;
