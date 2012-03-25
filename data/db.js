//status code
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/kokiya');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
var OK = {
	ok: 1
},
	NO = {
		ok: 0
	};

exports.mongoose = mongoose;
