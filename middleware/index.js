var middleware = middleware || {};

middleware.requireLogin = function (req,res,next) {
	if(req.session.uid) {
		next();
	} else {
		res.redirect('/login');
	}
}

middleware.

module.exports = middleware;