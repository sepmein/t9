console.log('lifetag script loaded');

var kokiya = kokiya || {};
kokiya.LifeTag = kokiya.LifeTag || Backbone.Model.extend({
	url: '/api/lifetags'
});

var app = new kokiya.Router;
Backbone.history.start();