//database meta
var mongoose = require('.././db.js').mongoose;

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
var OK = {
	ok: 1
},
	NO = {
		ok: 0
	};

/*-----------------------------------------------------------------*/

var Coupon = new Schema({
	//use validation here
	requester: {
		type: String,
		validation: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
	},
	reqTime: {
		type: Date,
	default:
		new Date
	},
	coupon: String
});

var C = mongoose.model('coupons', Coupon);

var coupon = coupon || {};

//申请优惠券
coupon.add = function(requester, callback) {
	var query = C.find({
		requester: requester
	});
	query.run(function(err, doc) {
		if (err) {
			callback(NO, err);
		} else {
			if (doc.length >= 1) {
				callback(NO, '看起来，您已经申请过了');
			} else {
				var newCoupon = new C();
				newCoupon.requester = requester;
				newCoupon.save(function(err) {
					if (!err) {
						callback(OK);
					} else {
						callback(NO, err);
					}
				});
			}
		}
	});
};

coupon.generate = function(callback) {

	var generateCoupon = function() {
			var s = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var result = "";
			for (var i = 6; i > 0; i--) {
				result += s.charAt(Math.floor(Math.random() * s.length));
			};
			return result;
		};

	//找到没有coupon的最早注册者，给他一个coupon
	var query = C.find();
	query.exists('coupon', false);
	query.asc('reqTime');
	query.limit(1);
	query.run(function(err, doc) {
		if (!err && doc.length != 0) {
			//update coupon code & notify user
			var conditions = {
				//err : missed []
				_id: doc[0]._id
			},
				update = {
					$set: {
						'coupon': generateCoupon()
					}
				},
				options = {

				};
			C.update(conditions, update, options, function(err, n) {
				if (!err) {
					callback(OK, doc[0].email);
					console.log('number affected :' + n);
				} else {
					callback(NO, err);
				}
			});
		} else if (doc.length == 0) {
			callback(NO, 'Requester has been drained.');
		} else {
			callback(NO, err);
		}
	});
};

coupon.delete = function(requester, coupon, callback) {
	var conditions = {
		requester: requester,
		coupon: coupon
	};
	C.remove(conditions, function(err) {
		if (!err) {
			callback(OK);
		} else {
			callback(NO, err);
		}
	});
};

coupon.check = function(requester, coupon, callback) {
	var conditions = {
		requester: requester,
		coupon: coupon
	};
	C.find(conditions, function(err, doc) {
		if (!err && (doc.length > 0)) {
			callback(OK);
		} else {
			callback(NO);
		}
	});
};

module.exports = coupon;
