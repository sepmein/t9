var db = db || {};
db.coupons = require('.././data/coupon');

var validateEmail = require('.././util').validateEmail;

var coupon = coupon || {};

coupon.requireCoupon = function(req, res, next) {
	var email = req.body.email;
	if (!validateEmail(email)) {
		//email 不符合要求
		res.json({
			ok: 0,
			err: 'Requiring Coupon: Wrong Email Address'
		});
	} else {
		db.coupons.add(email, function(status, err) {
			if (status.ok) {
				//success
				res.json({
					ok: 1
				});
			} else {
				res.json({
					ok: 0,
					err: err
				})
			}
		});
	}
};

coupon.welcome = function(req, res, next) {
	var email = req.query.email;
	var coupon = req.query.coupon;
	console.log('request email is ' + email + '\nrequest coupon is ' + coupon);
	db.coupons.check(email, coupon, function(status) {
		if (status.ok) {
			//email matches coupon
			res.render('welcome', {
				layout: false
			});
		} else {
			//don't match
			next();
		}
	});
};

module.exports = coupon;
