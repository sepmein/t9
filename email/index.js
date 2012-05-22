var ses = require('aws2js').load('ses', 'AKIAIBEFEBQPBURFZBHQ', 'LP+3Hme+TgYrYTW7ccOphS9sdXDvNPBqMH8cyRP9');

var email = email || {};

function send(to, template, locals) {
	ses.request('SendEmail', {
		'Destination.ToAddresses.member.1': to,
		'Message.Body.Html.Data': template.Body(locals),
		'Message.Subject.Data': template.Subject(),
		'Source': "crimde@gmail.com"
	}, function(err, response) {
		if (!err) {
			console.dir(response);
		} else {
			console.error(err);
		}
	});
};

email.sendCoupon = function(to, locals) {
	var sendCoupon = require('./template/sendCoupon.js');
	send(to, sendCoupon, locals);
};

email.couponApplyVerify = function(to, locals) {
	var couponApplyVerify = require('./template/couponApplyVerify.js');
	send(to, couponApplyVerify, locals);
}

module.exports = email;
