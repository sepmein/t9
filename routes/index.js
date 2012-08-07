var handlers = require('.././handlers');
var middleware = require('.././middleware');

module.exports = function(app) {
	app.get('/', middleware.requireLogin, handlers.renderIndex);

	app.get('/login', middleware.checkLogStatus, handlers.renderLogin);

	app.get('/api', handlers.renderApi);

	app.get('/logout', handlers.logout);

	app.get('/lifetag', middleware.requireLogin, handlers.renderLifeTag);

	// Log logic
	app.get('/welcome', handlers.welcome);

	app.post('/login', handlers.login);

	app.post('/requireCoupon', handlers.requireCoupon);

	app.post('/register', handlers.register);

	// Rest Api
	app.get('/api/posts', handlers.getPosts);

	app.post('/api/posts', middleware.requireLogin, handlers.postPosts);

	app.get('/api/posts/comment', handlers.getComments);

	app.post('/api/posts/comment', middleware.requireLogin, handlers.postComment);

	app.get('/api/serverInfo', handlers.getServerInfo);

	app.get('/api/users', handlers.getUsers);

	app.post('/api/lifetags', handlers.postLifeTags);

	//custom 404
	//app.get('/*', handlers.fourOFour);
	//vec
	app.get('/vec/start', handlers.renderVecStart);

	app.get('/vec', handlers.renderVec);

	app.get('/vec/:url', handlers.interpretor);

	app.post('/vec', handlers.createVec);

	app.del('/vec/:url', handlers.renderVec);

	app.put('/vec/:url', handlers.renderVec);
};