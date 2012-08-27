var unit = Object.create(null);
/**
default unit
sealed once set
*/
Object.defineProperty(unit, 'defaultUnit', {
	writable: 0,
	configurable: 1,
	enumerable: 1

});
unit.get = function() {
	return 'aloha';
};
unit.set = function(v) {
	this.defaultUnit = ''
};

Object.defineProperty(unit, 'value', {
	writable: 1,
	configurable: 1,
	enumerable: 1
});

var testUnit = Object.create(unit);
console.log(testUnit.get());
console.dir(Object.getOwnPropertyDescriptor(unit, 'defaultUnit'));