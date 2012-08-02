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
	
	//定义单位的javascript oop部分，核心算法
	function Unit() {
		this.defaultUnitGroup = {};
	}
	Unit.prototype.set = function(data, unit) {
		if (this.defaultUnitGroup.hasOwnProperty('unit')) {
			this.data = data * this.defaultUnitGroup[unit] / this.defaultUnitGroup[this.defaultUnit];
			this.unit = unit;
		} else if (!unit) {
			this.data = data;
			this.unit = this.defaultUnit;
		}
	};
	Unit.prototype.get = function(unit) {
		var o = {};
		if (!unit) {
			o.unit = this.defaultUnit;
			o.data = this.data * this.defaultUnitGroup[this.unit] / this.defaultUnitGroup[this.defaultUnit];
		} else if (this.defaultUnitGroup.hasOwnProperty(unit)) {
			o.unit = unit;
			o.data = this.data * this.defaultUnitGroup[this.unit] / this.defaultUnitGroup[unit];
		} else {
			o.unit = this.unit;
			o.data = this.data;
		}
		return o;
	};

	function Dose() {
		this.defaultUnitGroup = {
			ml: 1000,
			l: 1
		};
		this.defaultUnit = 'l';
	}
	Dose.prototype = new Unit;

	function Concentration() {
		this.defaultUnitGroup = {
			percent: 10000,
			mgml: 1000,
			mgl: 1,
			ppm: 1
		};
		this.defaultUnit = 'mgl';
	}
	Concentration.prototype = new Unit;


	var data = req.body.data;
	//这部分可以移至middleware
	var checked = function check(data) {
			//检查服务器发送数据是否符合要求，若符合返回1，否则返回0
			return 1;
		};

	if (checked) {
		//数据格式正确，将其翻译成可阅读的格式，也许这步只需要出现在前端
		var output = output || {};

		var raw = {},
			middle = {},
			end = {};

		//将data数据复制到output对象
		raw.c = new Concentration();
		raw.c.set(data.ConcentrationRaw.data, data.ConcentrationRaw.unit);

		end.ch = new Concentration();
		end.ch.set(data.ConcentrationHigh.data, data.ConcentrationHigh.unit);

		end.pr = data.PropotionRate;
		end.gn = data.GroupNumber;
		end.d = new Dose();
		end.d.set(data.Dose.data, data.Dose.unit);

		//将end.Concentration生成由高至低的终浓度数组
		end.c = [];
		//由0至组数循环，每组对CH除以i个PR，计算完成后推送至end.Concentration
		for (var i = 0; i < end.gn; i++) {
			var d = end.ch.get().data;
			while (i) {
				i--;
				d /= end.pr;
			}
			var ctemp = new Concentration();
			ctemp.set(d);
			end.c.push(ctemp);
		}

		//dose preparation
		end.dp = new Dose();
		end.dp.set(end.d.get().data * end.pr / (end.pr - 1), end.d.get().unit);

		//end.quantityHigh 需要的药剂重量
		end.qh = end.ch.get().data * end.dp.get().data;

		//middle partition
		middle.c = [];

		//计算中间需要稀释的组数
		for (var u = 0; Math.pow(10, 4 - u) > end.q; u--) {
			var cmtemp = new Concentration();
			cmtemp.set(Math.pow(10, 4 - u));
			middle.c.push(cmtemp);
		}

		//10 ratio dilution times，10倍稀释的次数
		middle.dt = u;
		//中间药剂配置的剂量以及取出改剂量配置下一中间浓度的剂量
		middle.d = new Dose();
		middle.d.set(1, 'ml');
		middle.dTake = new Dose();
		middle.dTake.set(0.1, 'ml');

		//取出最后一个中间浓度，配置终浓度的剂量 ＝ 终有效药量／中间最后一组浓度 所有单位已化为默认单位
		//这是整个计算过程中最复杂的一个中间量，最大的难度是单位换算，现已通过javascript oop解决
		middle.dTakeLast = new Dose();
		middle.dTakeLast.set(end.qh / middle.c[middle.c.length - 1].get('default'));

		raw.d = new Dose();
		raw.d.set(middle.c[0].get().data * middle.d.get())

	}

	console.log(end.c);

	/**
	 *母液配置
	 *
	 *浓度:由原药直接稀释成母液,计量:待计算
	 */

	output = {
		raw: raw,
		middle: middle,
		end: end
	}

} else {
	next(new Error('[vector]数据格式有误，请检查'));
}

};

module.exports = vector;