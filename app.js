var server = require('./server.js');
var route = require('./routes');
var coupon = require('./coupon.js');

var configure = require('./configure');

server.start(route, configure.server);
coupon.startService(configure.coupon);