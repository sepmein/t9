var middleware = middleware || {};

middleware.requireLogin = function(req, res, next) {
	if (req.session.uid) {
		next();
	} else {
		res.redirect('/login');
	}
};

middleware.checkLogStatus = function(req, res, next) {
	if (req.session.uid) {
		res.redirect('/');
	} else {
		next();
	}
};

module.exports = middleware;
