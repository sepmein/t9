(function() {
	var holder = document.getElementById('holder');
	var paper = Raphael(holder, 1280, 800);

	var preference = {
		P: [640, 400],
		ALPHA: 30,
		MAXRANGE: 1000,
		NUMOFTRACE: 700,
		MAGNITUDE: {
			NUM: [10, 23, 67, 229, 738, 2420],
			LIGHT: [1, 1 / 1.4, 1 / 1.4 / 1.4, 1 / 1.4 / 1.4 / 1.4, 1 / 1.4 / 1.4 / 1.4 / 1.4, 1 / 1.4 / 1.4 / 1.4 / 1.4 / 1.4, 1 / 1.4 / 1.4 / 1.4 / 1.4 / 1.4 / 1.4]
		}
	};

	function starTrace(P) {

		paper.customAttributes.arc = function(origin, degree, distance, alpha) {
			var coords = getCoords(origin, degree, distance, alpha);
			var path = [
				['m', coords[0][0], coords[0][1]],
				['a', distance, distance, 0, 0, 1, (coords[1][0] - coords[0][0]), (coords[1][1] - coords[0][1])]
			];
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
		}

		function getCoords(o, d, dis, al) {
			var coords = [
				[],
				[]
			];
			var radians = (d / 180) * Math.PI;
			var radiansPlus = ((d + al) / 180) * Math.PI;
			coords[0][0] = o[0] + Math.cos(radians) * dis;
			coords[0][1] = o[1] + Math.sin(radians) * dis;
			coords[1][0] = o[0] + Math.cos(radiansPlus) * dis;
			coords[1][1] = o[1] + Math.sin(radiansPlus) * dis;
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

		/*		function getRandomSVGString() {
			var origin = P.P,
				degree = Math.random() * 360,
				distance = Math.random() * P.MAXRANGE;
			var coords = [getCoords(origin, degree, distance), getCoords(origin, degree + P.ALPHA, distance)];
			//console.log(coords);
			var svg = 'm' + coords[0][0] + ',' + coords[0][1] + 'a' + distance + ',' + distance + ',0,0,1,' + (coords[1][0] - coords[0][0]) + ',' + (coords[1][1] - coords[0][1]);
			//console.log(svg);
			return svg;
		}
*/
		for (var i = P.NUMOFTRACE; i--; i > 0) {
			var distance = Math.random() * P.MAXRANGE,
				degree = Math.random() * 360,
				al = P.ALPHA;
			paper.path().attr({
				arc: [P.P, degree, distance, al],
				magnitude: []
			});
		}

		/*paper.forEach(function(el) {
			var m = magnitude();
			el.attr({
				stroke: "white",
				"stroke-width": m.strokeWidth,
				opacity: m.opacity
			});*/
		/*el.glow({
				width: m.glowWidth,
				color: 'grey',
				opacity: m.opacity
			});*/
		//});
		setTimeout(function() {
			paper.forEach(function(el) {
				console.log(el);
				var d = el.attrs.arc[1],
					dis = el.attrs.arc[2],
					al = el.attrs.arc[3]+30;
				//console.log(dis);
				var elattrs = [{
					arc: [P.P, d ,dis, al]
				}];
				el.animate(elattrs, 1000);
			})
		}, 1000);
	}

	starTrace(preference);

})();