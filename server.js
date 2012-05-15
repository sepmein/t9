var express = require('express');

var start = function() {
		var app = module.exports = express.createServer();

		// Configuration
		app.configure(function() {
			app.set('views', __dirname + '/views');
			app.set('view engine', 'jade');
			app.use(express.bodyParser());
			app.use(express.methodOverride());
			app.use(express.cookieParser());
			app.use(express.session({
				secret: 'Crimson~87',
				store: sessionStore,
				cookie: {
					maxAge: 60000 * 60 * 24 * 30 * 6
				}
			}));
			app.use(app.router);
			app.use(express.static(__dirname + '/public'));
		});

		app.configure('development', function() {
			app.use(express.errorHandler({
				dumpExceptions: true,
				showStack: true
			}));
		});

		app.configure('production', function() {
			app.use(express.errorHandler());
		});
		app.listen(8000);
	};

exports.start = start;
