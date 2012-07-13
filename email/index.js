var ses = require('aws2js').load('ses', 'AKIAIBEFEBQPBURFZBHQ', 'LP+3Hme+TgYrYTW7ccOphS9sdXDvNPBqMH8cyRP9');

var email = email || {};

function send(to, template, locals) {
	ses.request('SendEmail', {
		'Destination.ToAddresses.member.1': to,
		'Message.Body.Html.Data': template.Body(locals),
		'Message.Subject.Data': template.Subject(),
		'Source': "no.reply.kokiya@gmail.com"
	}, function(err, response) {
		if (!err) {
			console.dir(response);
		} else {
			console.error(err);
		}
	});
};

/*
	bug
		1. 链接中的 & 符号变成了 &amp;
	solved
		1. coupon变成undefined 
			A: db.coupons query的coupon还未set.
			S: use local var generateCoupon 
*/
email.sendCoupon = function(to, coupon) {
	var sc = require('./template/sendCoupon.js');
	var locals = {};
	locals.link = 'http://kokiya.no.de/welcome/?email=' + to + '&coupon=' + coupon;
	console.log('generated locals.link is ' + locals.link);
	send(to, sc, locals);
};

module.exports = email;
