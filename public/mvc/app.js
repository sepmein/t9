var Post = Backbone.Model.extend({
	//idAttribute
	idAttribute : '_id',
	defaults : {
		author : '',
		timeStamp : '',
		comments : []
	},
	initialize : function() {
		// bind change
		this.bind('change',function(){

		});
		this.bind('change:author',function(){

		});
		this.bind('change:comments',function(){

		});
		this.bind('error',function(model,error){

		});
	},
	validate : function(attribs){

	}
});

var PostCollections = Backbone.Collection.extend({
	model : Post
});

var PostView = Backbone.View.extend({
	el:$('#main')
	, render : function(event){
		var compiled_template = _.template($('#postTemplate').html);
		this.el.html(compiled_template(this.model.toJSON()));
		return this;
	}
	, events : {
		'click .comment' : 'comment',
		'click .del' : 'del',
		'click .plus' : 'plus',
		'click .minus' : 'minus'
	}
	, comment : function(event){

	}
	, del : function(event){

	}
	, plus : function(event){

	}
	, minus : function(event){

	}
});