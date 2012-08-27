var unit = Object.create(null);

unit.description = '';
Object.defineProperty(unit, 'alias', {
	writable: 0,
	configurable: 1,
	enumerable: 1,
	value: []
});
/**
检验o是否符合规定，若符合，添加至unit group
@method addGroup
@
*/
unit.addUnitToGroup = function(o) {
	if (1) {
		this.alias.push(o);
	} else {

	}
};
/**
获取该类型的
*/
unit.list = function(){
	var list = [];
	for (var i = this.alias.length - 1 ; i >= 0 ;i--){
		list.push(this.alias[i].name);
	}
	return list;
};
unit.add = function(a, b) {
	if(a.value) {

	}
};


var weight = Object.create(unit);
weight.description = '重量';
weight.addUnitToGroup({
	name: 'g',
	multiplier: 1000
});
weight.addUnitToGroup({
	name: 'mg',
	multiplier: 1
});
console.dir(weight.alias);
console.dir(weight.list());