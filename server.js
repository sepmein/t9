var express = require('express');
//mongoose session store by mongoose session, maybe rewrite it by myself later
var SessionMongoose = require("session-mongoose");
var sessionStore = new SessionMongoose({
	url: "mongodb://localhost/session",
	interval: 60000 * 60 * 24 * 30 * 6
});


function start(route) {

	var app = module.exports = express.createServer();

	// Configuration
	// seperation is under consideration
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
		//app.enabled('view cache');
		app.use(express.errorHandler());
	});

	var port = 80;
	//end of configuration
	app.listen(port);

	route(app);

	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
};

exports.start = start;
