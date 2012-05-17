var handlers = require('.././handlers');
var middleware = require('.././middleware');

module.exports = function(app) {
	app.get('/', middleware.requireLogin, handlers.renderIndex);

	app.get('/login', middleware.checkLogStatus, handlers.renderLogin);

	app.get('/api', handlers.renderApi);

	app.get('/logout', handlers.logout);

	app.get('/lifetag', middleware.requireLogin, handlers.renderLifeTag);

	app.post('/login', handlers.login);

	app.post('/requireCoupon', handlers.requireCoupon);

	// Rest Api
	app.get('/api/posts', handlers.getPosts);

	app.post('/api/posts', middleware.requireLogin, handlers.postPosts);

	app.get('/api/posts/comment', handlers.getComments);

	app.post('/api/posts/comment', middleware.requireLogin, handlers.postComment);

	app.get('/api/serverInfo', handlers.getServerInfo);

	app.get('/api/users', handlers.getUsers);

//	app.post('/register', handlers.register);

	app.post('/api/lifetags', handlers.postLifeTags);
};
