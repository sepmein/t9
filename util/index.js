/**
 * kokiya 功能包，为其他模块提供快捷程序
 * @module util
 */
var util = util || {};

/**
 * 验证邮件地址，使用正则表达式
 * @method validateEmail
 * @param {String} email Email地址
 * @return {Boolean} 成功返回1，否则返回0
 */
util.validateEmail = function(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

/**
 * 生成随机字符串
 * @method generateRandom
 * @param {Num} length 生成
 * @return {String} 长度为length、包含数字及大小写、随机排列的字符串
 */
util.generateRandom = function(length) {
	var s = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var result = "";
	for (var i = length || 6; i > 0; i--) {
		result += s.charAt(Math.floor(Math.random() * s.length));
	};
	return result;
}

module.exports = util;