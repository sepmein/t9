var db = db || {};
db.coupons = require('.././data/coupon');

var coupon = coupon || {};

coupon.requireCoupon = function(email) {
	if(!validate(email)) {
		//email 不符合要求
	} else {
		db.coupons.add(email, )
	}
}

module.exports = coupon;