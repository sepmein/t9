//coupon
var coupon = function(callback) {
		var flow = {
			//interval unit:day
			interval: 1,
			requesters: 5
		};
		callback(flow);
	};

exports.coupon = coupon;
