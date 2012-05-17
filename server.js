var express = require('express'); 
//mongoose session store by mongoose session, maybe rewrite it by myself later
var SessionMongoose = require("session-mongoose");
var sessionStore = new SessionMongoose({
	url: "mongodb://localhost/session",
	interval: 60000 * 60 * 24 * 30 * 6
});


function start(route, configure) {

	var app = module.exports = express.createServer();

	// Configuration
	// seperation is under consideration
	coufigure(app);

	var port = 8000;
	//end of configuration
	app.listen(port);

	route(app);

	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
};

exports.start = start;
