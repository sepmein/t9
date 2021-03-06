//更换aws2js库至aws-lib
var sesKey = require('.././configure/key.js').ses;

var ses = require('aws-lib').createSESClient(sesKey.key, sesKey.pass);

var email = email || {};

function send(to, template, locals, callback) {
	var sendArgs = {
		'Destination.ToAddresses.member.1': to,
		'Message.Body.Html.Data': template.Body(locals),
		'Message.Subject.Data': template.Subject(),
		'Source': "no.reply.kokiya@gmail.com",
		'Message.Body.Html.Charset': 'UTF-8'
	};
	console.log('send email called');
	ses.call('SendEmail', sendArgs, function(err, response) {
		if (!err) {
			console.dir(response);
			callback(1);
		} else {
			console.error(err);
			callback(0, err);
		}
	});
};

/*
	bug
		1. 链接中的 & 符号变成了 &amp;
	solved
		1. coupon变成undefined 
			A: db.coupons query的coupon还未set.
			S: use local var generateRandom 
*/
email.sendCoupon = function(to, coupon) {
	var sc = require('./template/sendCoupon.js');
	var locals = {};
	locals.link = 'http://localhost:8000/welcome/?email=' + to + '&coupon=' + coupon;
	console.log('generated locals.link is ' + locals.link);
	send(to, sc, locals);
};

email.sendUrl = function(to, url, callback) {
	var sc = require('./template/vecSendUrl.js');
	var locals = {};
	locals.link = url;
	console.log('generated locals.link is ' + locals.link);
	send(to, sc, locals, callback);
};

module.exports = email;