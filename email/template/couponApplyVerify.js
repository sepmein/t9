//locals API
/*

{
	link: String
}

*/

var jade = require('jade'),
	path = __dirname + '/couponApplyVerify.jade',
	str = require('fs').readFileSync(path, 'utf8'),
	fn = jade.compile(str, {
		filename: path,
		pretty: true
	});

var Body = function(locals) {
		return fn(locals);
	};

var Subject = function() {
		return "您已向kokiya提交申请";
	};

exports.Body = Body;
exports.Subject = Subject;
