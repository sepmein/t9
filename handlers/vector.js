
//require partition
var generateRandom = require('.././util').genereteRandom;

var db = db || {};

db.vector = require('.././data/vector');

var vector = vector || {};


vector.renderVector = function(req, res, next){
	//进入新建页面
	if (!req.params.url) {
		//res.render();
		res.send('no url send');
	} else {
	//已建，从数据库读取
		res.send(req.params.url);

	}

	//req.param()
};

module.exports = vector;