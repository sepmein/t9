//this is the coupon app
/*
1. detect 

*/

var db = db || {};
db.coupons = require('./data/coupon');

var intervalId;
var coupon = coupon || {};
var sendCoupon = function(n) {
		console.log('Aloha! Spencer start sending coupons!!!!')
		var unsent = 0,
			count = n;
		var generate = function() {
				db.coupons.generate(function(status, info) {
					if (status.ok && count > 0) {
						count--;
						console.log('Yes! coupon sent to :' + info);
						//发送coupon至邮箱
						//从db删除coupon
						//循环自调用
						generate();
					} else {
						unsent++;
						console.log(info);
					}
				});
			};
		generate();
	};

coupon.startService = function(configure) {
	var flow = configure();
	intervalId = setInterval(function() {
		sendCoupon(flow.requesters);
	}, flow.interval * 24 * 60 * 60 * 1000);
};

coupon.stopService = function() {
	if (intervalId) {
		clearInterval(intervalId);
	}
};

coupon.reStart = function(flow) {
	stop();
	start(flow);
};

module.exports = coupon;
