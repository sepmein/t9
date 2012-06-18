//locals API
/*

{
	link: String
}

*/

var jade = require('jade'),
	path = __dirname + '/sendCoupon.jade',
	str = require('fs').readFileSync(path, 'utf8'),
	fn = jade.compile(str, {
		filename: path,
		pretty: true
	});

var Body = function(locals) {
		return fn(locals);
	};

var Subject = function() {
		return "kokiya 邀请码";
	};

exports.Body = Body;
exports.Subject = Subject;

//test
/*
var locals = {
	link: 'blablablabla'
};
console.log(fn(locals));
*/
