var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ktest');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var Post = new Schema({
	author	: String,
	content	: String,
	date	: Date,
	bio		: Buffer,
	comments: [Comments],
	meta 	: {
		plus	: Number,
		minus	: Number,
		favs	: Number
	}

});

var Comments = new Schema({
	author	: String,
	content	: String,
	date 	: Date
});

var P = mongoose.model('posts', Post);

var newPost = new P();
newPost.author = 'Spencer';
newPost.content = 'said something';
newPost.comments.push({
	author	: 'emily',
	content	: 'WTF!!!'
});
newPost.save(function(err){
	if(err) {
		console.log(err);
	} else {
		console.log('Success');
	}
});