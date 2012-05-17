var db = db || {};
db.coupons = require('.././data/coupon');

var validateEmail = require('.././util').validateEmail;

var coupon = coupon || {};

coupon.requireCoupon = function(req, res, next) {
	var email = req.body.email;
	if (!validateEmail(email)) {
		//email 不符合要求
		console.log('ERR requiring coupon : email validation err');
	} else {
		db.coupons.add(email, function(status, err) {
			if (status.ok) {
				//success
				console.log('Email: ' + email + ' has been added to the que');
			} else {
				console.log("ERR requiring coupon :" + err);
			}
		});
	}
};

coupon.welcome = function(req, res, next) {
	var email = req.query.email;
	var coupon = req.query.coupon;
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
