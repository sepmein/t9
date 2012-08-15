var express = require('express');
//mongoose session store by mongoose session, maybe rewrite it by myself later
var SessionMongoose = require("session-mongoose");
var sessionStore = new SessionMongoose({
	url: "mongodb://localhost/session",
	interval: 60000 * 60 * 24 * 30 * 6
});
var sessionSecret = require('./configure/key.js').sessionSecret;


function start(route) {

	var app = express();

	app.engine('jade', require('jade').__express);

	// Configuration
	// seperation is under consideration
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: sessionSecret,
		store: sessionStore,
		cookie: {
			maxAge: 60000 * 60 * 24 * 30 * 6
		}
	}));
	app.use(app.router);
	app.use(express.static('public'));

	if ('development' == app.get('env')) {
		app.use(express.errorHandler({
			dumpExceptions: true,
			showStack: true
		}));
	}

	if ('production' == app.get('env')) {
		//app.enabled('view cache');
		app.use(express.errorHandler());
	}

	var port = 8000;
	//end of configuration
	app.listen(port);

	route(app);

	//Api change express
	console.log("Express server listening on port %d in %s mode", port, app.settings.env);
};

exports.start = start;