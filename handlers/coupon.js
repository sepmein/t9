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

coupon.welcome = function(req,res,next){
		
};

module.exports = coupon;
