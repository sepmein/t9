var server = require('./server.js');
var route = require('./routes');
var coupon = require('./coupon.js');

server.start(route);
coupon.startService();