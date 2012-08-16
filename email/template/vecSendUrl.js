//locals API
/*

{
	link: String
}

*/

var jade = require('jade'),
	path = __dirname + '/vecSendUrl.jade',
	str = require('fs').readFileSync(path, 'utf8'),
	fn = jade.compile(str, {
		filename: path,
		pretty: true
	});

var Body = function(locals) {
		return fn(locals);
	};

var Subject = function() {
		return "发送配方链接－－－来自Vec（生物测定－药剂配制系统）";
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
