(function() {
	var holder = document.getElementById('holder');
	var paper = Raphael(holder, 2000, 2000);

	var preference = {
		P: [400, 400],
		ALPHA: 30,
		MAXRANGE: 900,
		NUMOFTRACE: 1000,
		MAGNITUDE: {
			ONE: {
				num: 10
			},
			TWO: {
				num: 23
			},
			THREE: {
				num: 67
			},
			FOUR: {
				num: 229
			},
			FIVE: {
				num: 738
			},
			SIX: {
				num: 2420
			}
		}
	};

	function starTrace(P) {
		function getCoords(origin, degree, distance) {
			var coords = [];
			var radians = (degree / 180) * Math.PI;
			coords[0] = origin[0] + Math.cos(radians) * distance;
			coords[1] = origin[1] + Math.sin(radians) * distance;
			return coords;
		}

		function magnitude(){
			var m = {},
			grade = Math.random();
			m.opacity = grade;
			m.glowWidth = grade*5;
			return m;
		}

		function getRandomSVGString() {
			var origin = P.P,
				degree = Math.random() * 360,
				distance = Math.random() * P.MAXRANGE;
			var coords = [getCoords(origin, degree, distance), getCoords(origin, degree + P.ALPHA, distance)];
			//console.log(coords);
			var svg = 'm' + coords[0][0] + ',' + coords[0][1] + 'a' + distance + ',' + distance + ',0,0,1,' + (coords[1][0] - coords[0][0]) + ',' + (coords[1][1] - coords[0][1]);
			//console.log(svg);
			return svg;
		}

		for (var i = P.NUMOFTRACE; i--; i > 0) {
			paper.path(getRandomSVGString());
		}

		paper.forEach(function(el) {
			var m = magnitude();
			el.attr({
				stroke: "white"
			});
			el.glow({
				width: m.glowWidth,
				color: 'grey',
				opacity: m.opacity
			});
			el.attr({
				opacity: m.opacity
			});
		});
	}

	starTrace(preference);

})();