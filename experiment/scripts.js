(function(){
	var holder = document.getElementById('holder');
	var paper = Raphael(holder, 1280, 600);

	var preference = {
		P: [400, 250],
		ALPHA: 30,
		MAXRANGE: 1000,
		NUMOFTRACE: 3000,
		MAGNITUDE: {
			NUM: [10,23,67,229,738,2420],
			LIGHT: [1,1/1.4,1/1.4/1.4,1/1.4/1.4/1.4,1/1.4/1.4/1.4/1.4,1/1.4/1.4/1.4/1.4/1.4,1/1.4/1.4/1.4/1.4/1.4/1.4]
		}
	};

	function starTrace(P) {

		var magCount = P.MAGNITUDE.NUM;

		function getCoords(origin, degree, distance) {
			var coords = [];
			var radians = (degree / 180) * Math.PI;
			coords[0] = origin[0] + Math.cos(radians) * distance;
			coords[1] = origin[1] + Math.sin(radians) * distance;
			return coords;
		}

		function magnitude(){
			var m = {};
			var grade = function(){
				var g;
				if(preference.MAGNITUDE.NUM[0]){
					g = preference.MAGNITUDE.LIGHT[0];
					preference.MAGNITUDE.NUM[0]--;
				} else if(preference.MAGNITUDE.NUM[1]){
					g = preference.MAGNITUDE.LIGHT[1];
					preference.MAGNITUDE.NUM[1]--;
				} else if(preference.MAGNITUDE.NUM[2]){
					g = preference.MAGNITUDE.LIGHT[2];
					preference.MAGNITUDE.NUM[2]--;
				} else if(preference.MAGNITUDE.NUM[3]){
					g = preference.MAGNITUDE.LIGHT[3];
					preference.MAGNITUDE.NUM[3]--;
				} else if(preference.MAGNITUDE.NUM[4]){
					g = preference.MAGNITUDE.LIGHT[4];
					preference.MAGNITUDE.NUM[4]--;
				} else if(preference.MAGNITUDE.NUM[5]){
					g = preference.MAGNITUDE.LIGHT[5];
					preference.MAGNITUDE.NUM[5]--;
				}
				return g;
			}();
			m.opacity = grade;
			m.strokeWidth = grade*2;
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
				stroke: "white",
				"stroke-width": m.strokeWidth,
				opacity: m.opacity
			});
			/*el.glow({
				width: m.glowWidth,
				color: 'grey',
				opacity: m.opacity
			});*/
		});
	}

	starTrace(preference);

})();
