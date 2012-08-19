//coupon
var coupon = function() {
		var flow = {
			//interval unit:day
			interval: 1/24,
			requesters: 5
		};
		return flow;
	};

exports.coupon = coupon;
