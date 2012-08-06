//database meta
var mongoose = require('.././db.js').mongoose;

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

/*-----------------------------------------------------------------*/
var Vec = new Schema({
	url: String,
	data: {
		concentrationRaw: {
			data: Number,
			unit: {
				type: String,
				enum: ['percent', 'mg/mL', 'mg/L', 'ppm'],
				default: 'percent'
			}
		},
		concentrationHigh: {
			data: Number,
			unit: {
				type: String,
				enum: ['percent', 'mg/mL', 'mg/L', 'ppm'],
				default: 'mg/L'
			}
		},
		propotionRate: Number,
		groupNumber: Number,
		dose: {
			data: Number,
			unit: {
				type: String,
				enum: ['uL', 'mL', 'L']
			}
		}
	}
});

var V = mongoose.model('vecs', Vec);

var vec = vec || {};

vec.add = function add(d, callback) {
	var newVec = new V();
	newVec.url = d.url;
	newVec.data = d.data;
	newVec.save(function(err) {
		if (!err) {
			callback(1);
		} else {
			callback(0, err);
		}
	});
};

vec.find = function find(url, callback) {
	V.find({
		url: url
	}, function(err, docs) {
		if (!err) {
			callback(1, docs);
		} else {
			callback(0, err);
		}
	});
};

module.exports = vec;