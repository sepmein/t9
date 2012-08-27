//require partition
/**
 * @requires 
 */
var generateRandom = require('.././util').generateRandom;

var db = db || {};
db.vecs = require('.././data/vec');

var email = email || {};
email.vecSendUrl = require('.././email').sendUrl;

var vec = vec || {};

vec.renderVec = function renderVec(req, res, next) {
	db.vecs.find(0, function(status, d) {
		if (status && d.length) {
			res.render('vec', d);
		} else {
			res.render('vec', d);
		}
	});
	//进入新建页面
	/*
	console.dir(req.params);
	console.log('hahah');
	if (!req.params.url) {
		//res.render();
		res.render('vec');
		console.log('no url send');
	} else {
		//已建，从数据库读取
		res.send(req.params.url);
		console.log(req.params.url);
	}

	//req.param()
	*/
};

vec.renderVecStart = function renderVecStart(req, res, next) {
	res.render('vec/start.jade');
};

vec.createVec = function createVec(req, res, next) {
	//verify
	//这部分可以移至middleware
	//fake
	var checked = function check(data) {
			//检查服务器发送数据是否符合要求，若符合返回1，否则返回0
			return 1;
		};
	if (checked) {
		//res.redirect('/');
		//store into db
		//redirect to generated url
		//db.vec.store()
		var newVec = {
			url: null,
			data: {
				concentrationRaw: {
					data: null,
					unit: null
				},
				concentrationHigh: {
					data: null,
					unit: null
				},
				dose: {
					data: null,
					unit: null
				},
				groupNumber: null,
				propotionRate: null
			}
		};
		newVec.url = generateRandom();
		newVec.data.concentrationRaw.data = req.body.concentrationRaw;
		newVec.data.concentrationRaw.unit = 'percent';
		newVec.data.concentrationHigh.data = parseFloat(req.body.concentrationHigh, 10);
		newVec.data.concentrationHigh.unit = req.body.concentrationHighUnit;
		newVec.data.propotionRate = req.body.propotionRate;
		newVec.data.groupNumber = req.body.groupNumber;
		newVec.data.dose.data = req.body.dose;
		newVec.data.dose.unit = req.body.doseUnit;
		//console.dir(newVec);
		db.vecs.add(newVec, function(status, err) {
			if (status) {
				res.redirect('/vec/' + newVec.url);
			} else {
				res.end(err);
			}
		});

	} else {
		next(new Error('[vec]数据格式有误，请检查'));
	}
};

vec.interpretor = function interpretor(req, res, next) {

	//定义单位的javascript oop部分，核心算法
	//问题：javascript计算容易出现误差
	/**
	 *
	 * 
	 */
	//using ES5 style for object inhenritence
	function Unit() {
		this.defaultUnitGroup = {};
	}
	Unit.prototype.set = function(data, unit) {
		if (this.defaultUnitGroup.hasOwnProperty(unit)) {
			this.unit = unit;
		} else if (!unit) {
			this.unit = this.defaultUnit;
		}
		this.data = data;
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
	Unit.prototype.toPrec = function(numLength) {
		if (!isNaN(this.data)) {
			this.data = this.data.toPrecision(numLength);
		} else {
			this.data = parseFloat(this.data).toPrecision(numLength);
		}
	};

	function Dose() {
		this.defaultUnitGroup = {
			mL: 1,
			L: 1000,
			uL: 0.001
		};
		this.defaultUnit = 'mL';
	}
	Dose.prototype = new Unit;

	function Concentration() {
		this.defaultUnitGroup = {
			percent: 10000,
			'mg/mL': 1000,
			'mg/L': 1,
			'ppm': 1
		};
		this.defaultUnit = 'mg/L';
	}
	Concentration.prototype = new Unit;

	//console.log(req.params);
	/*
	 * query url from db, return data, interprete it into views
	 *
	 */
	db.vecs.find(req.params.url, function(status, d) {
		if (status) {
			//console.log(d);
			//finish this part for better api
			/**
			 * Input data API reference
			 *
			 *{
			 *	ConcentrationRaw: {
			 *		data: Number
			 *		unit: String
			 *	},
			 *	ConcentrationHigh: {
			 *		data: Number
			 *		unit: String
			 *	},
			 *	PropotionRate: Number,
			 *	GroupNumber: Number,
			 *	Dose: {
			 *		data: Number,
			 *		unit: String
			 *	}
			 */
			//doc is an array
			var dt = d[0].data;

			//console.dir(data);
			//数据格式正确，将其翻译成可阅读的格式，也许这步只需要出现在前端
			var output = output || {};

			var raw = {},
				middle = {},
				end = {};

			//将dt数据复制到output对象
			raw.c = new Concentration();
			raw.c.set(dt.concentrationRaw.data, dt.concentrationRaw.unit);
			//console.log('raw.c是');
			//console.log(raw.c.get());
			end.ch = new Concentration();
			end.ch.set(dt.concentrationHigh.data, dt.concentrationHigh.unit);
			//console.log('end.ch是');
			//console.log(end.ch.get());
			end.pr = dt.propotionRate;
			end.gn = dt.groupNumber;
			end.d = new Dose();
			end.d.set(dt.dose.data, dt.dose.unit);
			//console.log(end);
			//将end.concentration生成由高至低的终浓度数组
			end.c = [];
			//由0至组数循环，每组对CH除以i个PR，计算完成后推送至end.Concentration
			for (var i = 0; i < end.gn; i++) {
				var d = parseFloat(end.ch.get().data, 10);
				//	console.log(d);
				var iu = i;
				while (iu) {
					iu--;
					d /= end.pr;
				}
				var ctemp = new Concentration();
				ctemp.set(d);
				end.c.push(ctemp);
			}

			//console.log(end);
			//dose preparation
			end.dp = new Dose();
			end.dp.set(end.d.get().data * end.pr / (end.pr - 1), end.d.unit);
			end.dTake = new Dose();
			end.dTake.set(end.dp.get().data - end.d.get().data);

			//end.quantityHigh 需要的药剂重量
			end.qh = end.ch.get().data * end.dp.get().data / 1000;

			//middle partition
			middle.c = [];

			//计算中间需要稀释的组数
			for (var u = 0; Math.pow(10, 4 - u) / 1000 > end.qh; u++) {
				var cmtemp = new Concentration();
				cmtemp.set(Math.pow(10, 4 - u), 'mg/L');
				middle.c.push(cmtemp);
				//	console.log('balbalba');
			}

			//10 ratio dilution times，10倍稀释的次数
			middle.dt = u;
			//中间药剂配置的剂量以及取出改剂量配置下一中间浓度的剂量
			middle.d = new Dose();
			middle.d.set(1, 'mL');
			middle.dTake = new Dose();
			middle.dTake.set(0.1, 'mL');

			//取出最后一个中间浓度，配置终浓度的剂量 ＝ 终有效药量／中间最后一组浓度 所有单位已化为默认单位
			//这是整个计算过程中最复杂的一个中间量，最大的难度是单位换算，现已通过javascript oop解决
			middle.dTakeLast = new Dose();
			//console.log(middle.c);
			middle.dTakeLast.set(end.qh / middle.c[middle.c.length - 1].get().data * 1000);

			raw.d = new Dose();
			//console.log('middle.c[0].get().data : ' + middle.c[0].get().data + '' + middle.c[0].get().unit);
			//console.log('raw.c.get().data : ' + raw.c.get().data + '' + raw.c.get().unit);
			raw.d.set(middle.c[0].get().data * middle.d.get(middle.d.unit).data / raw.c.get().data, middle.d.unit);
			//console.log('raw.d is ');
			//console.log(raw.d);
			/**
			 *母液配置
			 *
			 *浓度:由原药直接稀释成母液,计量:待计算
			 */
			raw.d.toPrec(4);
			middle.dTakeLast.toPrec(4);
			for (var i = 0; i < end.c.length; i++) {
				end.c[i].toPrec(4);
				//console.dir(end.c[i].data);
			}
			end.dp.toPrec(4);
			end.dTake.toPrec(4);
			output = {
				raw: raw,
				middle: middle,
				end: end
			};

			//res.
			res.render('vec/output', output);
			//res.json(output);
		} else {
			//console.log(d);
		}
	});

};

vec.sendUrl = function sendUrl(req, res, next) {
	/**
	 * sendUrl api
	 * 将配方地址发送给特定邮箱
	 * 
	 * {
	 * 		to : String //收件人地址
	 * 		,url : String //配方地址
	 * }
	 * 
	 */
	var to = req.body.to;
	var url = req.body.url;
	email.vecSendUrl(to, url, function(status, info) {
		if (status) {
			res.json({
				status: 1
			});
		} else {
			res.json({
				status: 0,
				err: info
			});
		}
	});
};

module.exports = vec;