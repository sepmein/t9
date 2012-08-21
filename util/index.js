/**
 * kokiya 功能包，为其他模块提供快捷程序
 * @module util
 */
var util = util || {};

/**
 * 验证邮件地址，使用正则表达式
 * @method validateEmail
 * @param {String} email Email
 * @return {Boolean} 成功返回1，否则返回0
 */
util.validateEmail = function(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

util.generateRandom = function(o) {
	var s = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var result = "";
	for (var i = o || 6; i > 0; i--) {
		result += s.charAt(Math.floor(Math.random() * s.length));
	};
	return result;
}

module.exports = util;