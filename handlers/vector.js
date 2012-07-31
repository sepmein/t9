//require partition
var generateRandom = require('.././util').genereteRandom;

var db = db || {};

//db.vector = require('.././data/vector');
var vector = vector || {};

vector.renderVector = function(req, res, next) {
	//进入新建页面
	console.dir(req.params);
	console.log('hahah');
	if (!req.params.url) {
		//res.render();
		res.end('no url send');
		console.log('no url send');
	} else {
		//已建，从数据库读取
		res.send(req.params.url);
		console.log(req.params.url);
	}

	//req.param()
};

vector.interpretor = function(req, res, next) {
	var data = req.body.data;
	//这部分可以移至middleware
	var checked = function check(data) {
			//检查服务器发送数据是否符合要求，若符合返回1，否则返回0
			return 1;
		};

	if (checked) {
		//数据格式正确，将其翻译成可阅读的格式，也许这步只需要出现在前端
		var output = output || {
			raw: {},
			end: {}
		};

		//将data数据复制到output对象
		output.raw.Consistency = data.ConsistencyRaw;
		output.end.PropotionRate = data.PropotionRate;
		output.end.ConsistencyHigh = data.ConsistencyHigh;
		output.end.GroupNumber = data.GroupNumber;
		output.end.Dose = data.Dose;

		//将end.Consistency生成由高至低的终浓度数组
		output.end.Consistency = [];
		//由0至组数循环，每组对CH除以i个PR，计算完成后推送至end.Consistency
		for (var i = 0; i++; i < data.GroupNumber) {
			var d = data.ConsistencyHigh;
			while (i) {
				i--;
				d /= PropotionRate;
			}
			output.end.Consistency.push(d);
		}

		console.log(output.end.Consistency);

	} else {
		next(new Error('[vector]数据格式有误，请检查'));
	}

};

module.exports = vector;