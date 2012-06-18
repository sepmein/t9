(function() {
	var holder = document.getElementById('holder');
	var paper = Raphael(holder, 2000, 2000);

	var preference = {
		P: [400, 400],
		ALPHA: 30,
		MAXRANGE: 900,
		NUMOFTRACE: 1000,
		MAGNITUDE: {
			NUM: [10,23,67,229,738,2420],
			LIGHT: [2.51*2.51*2.51*2.51*2.51,2.51*2.51*2.51*2.51,2.51*2.51*2.51,2.51*2.51,2.51,1]
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
			var m = {};
			/*var grade = function(){
				var g;
				if(!P.MAGNITUDE.NUM[0]){
					g = 1;
					!P.MAGNITUDE.NUM[0]--;
				} else if(!P.MAGNITUDE.NUM[1]){
					g = 2;
					!P.MAGNITUDE.NUM[1]--;
				} else if(!P.MAGNITUDE.NUM[2]){
					g = 3;
					!P.MAGNITUDE.NUM[2]--;
				} else if(!P.MAGNITUDE.NUM[3]){
					g = 4;
					!P.MAGNITUDE.NUM[3]--;
				} else if(!P.MAGNITUDE.NUM[4]){
					g = 5;
					!P.MAGNITUDE.NUM[4]--;
				} else if(!P.MAGNITUDE.NUM[5]){
					g = 6;
					!P.MAGNITUDE.NUM[5]--;
				}
				return g; 
			};*/
			var grade = Math.random();
			m.opacity = grade*0.2;
			m.glowWidth = grade*3;
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