var server = require('./server.js');
var route = require('./routes');
var coupon = require('./coupon.js');

var configure = require('./configure');

//console.dir(require.cache);

server.start(route);
coupon.startService(configure.coupon);