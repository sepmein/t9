var holder = document.getElementById('holder');
var paper = Raphael(holder, 1280, 800);

var preference = {
	P: [640, 400],
	ALPHA: 0,
	MAXRANGE: 1000,
	NUMOFTRACE: 1000,
	MAGNITUDE: {
		NUM: [10, 23, 67, 229, 738, 2420],
		LIGHT: [1, 1 / 1.35, 1 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35 / 1.35 / 1.35, 1 / 1.35 / 1.35 / 1.35 / 1.35 / 1.35 / 1.35]
	}
};

function starTrace(P) {

	//计算svg path elliptical arc算法的customAttributes函数
	paper.customAttributes.arc = function(origin, degree, distance, alpha) {
		var coords = getCoords(origin, degree, distance, alpha);
		//第二个参数的区县算法需要改进，0～180,180～360,360～540。。。
		//alpha相对180的倍数，再mod 2，这样就能划分区间
		var a = Math.floor(alpha / 180) % 2;
		//console.log(alpha);
		//console.log(a);
		var path = 'M'+coords[0][0]+' '+coords[0][1]+'a'+distance+' '+distance+' '+0+' '+a+' '+1+' '+(coords[1][0] - coords[0][0])+' '+(coords[1][1] - coords[0][1]);
		return {
			path: path
		};
	};

	paper.customAttributes.magnitude = function() {
		var m = magnitude();
		return {
			stroke: "white",
			"stroke-width": m.strokeWidth,
			opacity: m.opacity
		}
	};

	function getCoords(o, d, dis, al) {
		var coords = [
			[],
			[]
		];
		//console.log('[FN]:getCoords - '+640+' '+d+' '+dis+' '+al);
		var radians = (d / 180) * Math.PI,
			alpha = al % 360,
			radiansPlus = ((d + alpha) / 180) * Math.PI;
		coords[0][0] = 640 + Math.cos(radians) * dis;
		coords[0][1] = 400 + Math.sin(radians) * dis;
		coords[1][0] = 640 + Math.cos(radiansPlus) * dis;
		coords[1][1] = 400 + Math.sin(radiansPlus) * dis;
		//console.log(coords);
		return coords;
	}

	function magnitude() {
		var m = {};
		var grade = function() {
				var g;
				if (preference.MAGNITUDE.NUM[0]) {
					g = preference.MAGNITUDE.LIGHT[0];
					preference.MAGNITUDE.NUM[0]--;
				} else if (preference.MAGNITUDE.NUM[1]) {
					g = preference.MAGNITUDE.LIGHT[1];
					preference.MAGNITUDE.NUM[1]--;
				} else if (preference.MAGNITUDE.NUM[2]) {
					g = preference.MAGNITUDE.LIGHT[2];
					preference.MAGNITUDE.NUM[2]--;
				} else if (preference.MAGNITUDE.NUM[3]) {
					g = preference.MAGNITUDE.LIGHT[3];
					preference.MAGNITUDE.NUM[3]--;
				} else if (preference.MAGNITUDE.NUM[4]) {
					g = preference.MAGNITUDE.LIGHT[4];
					preference.MAGNITUDE.NUM[4]--;
				} else if (preference.MAGNITUDE.NUM[5]) {
					g = preference.MAGNITUDE.LIGHT[5];
					preference.MAGNITUDE.NUM[5]--;
				}
				return g;
			}();
		m.opacity = grade;
		m.strokeWidth = grade * 2;
		return m;
	}

	var set = paper.set();

	for (var i = P.NUMOFTRACE; i--; i > 0) {
		var distance = Math.random() * P.MAXRANGE,
			degree = Math.random() * 360,
			al = P.ALPHA;
		set.push(paper.path().attr({
			magnitude: []
		}).attr({
			arc: [P.P, degree, distance, al]
		}));
	}

	(function() {
		set.forEach(function(el) {
			//console.log(el);
			var d = el.attrs.arc[1],
				dis = el.attrs.arc[2],
				al = el.attrs.arc[3];
			//console.log(dis);
			var animate = Raphael.animation([{
				arc: [[640,400], d, dis, al + 0.12]
			}]);
			//console.log([[640,400], d, dis, (al + 30)]);
			//console.log(paper.customAttributes.arc([[640,400], d, dis, (al + 30)]));
			el.animate({
				arc: [[640,400], d, dis, (al + 360)]
			}, 1200000, 'linear');
		});
	})();

}

starTrace(preference);
