for (var u = 0; Math.pow(10, 4 - u) > 9; u++) {}

console.log(u);


function Unit() {
	this.defaultUnitGroup = {};
}
Unit.prototype.set = function(data, unit) {
	if (this.defaultUnitGroup.hasOwnProperty('unit')) {
		this.data = data * this.defaultUnitGroup[unit] / this.defaultUnitGroup[this.defaultUnit];
		this.unit = unit;
	} else if (unit === 'default') {
		this.data = data;
		this.unit = this.defaultUnit;
	}
};
Unit.prototype.get = function(unit) {
	var o = {};
	if (unit === 'default') {
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


var c = new Concentration();
c.set(100,'default');
console.log(c.get('mgml'));

