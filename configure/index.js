//coupon
var coupon = function() {
		var flow = {
			//interval unit:day
			interval: 1/24/60,
			requesters: 5
		};
		return flow;
	};

exports.coupon = coupon;
