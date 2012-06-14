(function() {
	var holder = document.getElementById('holder');
	var paper = Raphael(holder, 1000, 1000);
	/*	var circle = paper.circle(0, 0, 50);
	var path = paper.path('m50,50c0,40,50,40,50,0');
	var path1 = paper.path('m50,100s25,70,50,0');
	var path2 = paper.path('m50,150q25,70,50,0');
	var path3 = paper.path('m50,200t50,0t0,50z');
	var e = paper.path('m50,300a50,50,0,0,1,100,0');*/
	var preference = {
		P: [400, 400],
		ALPHA: 30,
		MAXRANGE: 900,
		NUMOFTRACE: 700
	};

	function starTrace(P) {
		function getCoords(origin, degree, distance) {
			var coords = [];
			var radians = (degree / 180) * Math.PI;
			coords[0] = origin[0] + Math.cos(radians) * distance;
			coords[1] = origin[1] + Math.sin(radians) * distance;
			return coords;
		}

		function getRandomSVGString() {
			var origin = P.P,
				degree = Math.random() * 360,
				distance = Math.random() * P.MAXRANGE;
			var coords = [getCoords(origin, degree, distance), getCoords(origin, degree + P.ALPHA, distance)];
			console.log(coords);
			var svg = 'm' + coords[0][0] + ',' + coords[0][1] + 'a' + distance + ',' + distance + ',0,0,1,' + (coords[1][0] - coords[0][0]) + ',' + (coords[1][1] - coords[0][1]);
			console.log(svg);
			return svg;
		}
		//testing
		/*var point = [getCoords([300, 300], -30, 200), getCoords([300, 300], 0, 200)];
	console.log(point);
	paper.path('m' + P.P[0] + ',' + P.P[0] + 'l' + (point[0][0] - 300) + ',' + (point[0][1] - 300) + 'a' + '300,300,0,0,1,' + (point[1][0] - point[0][0]) + ',' + (point[1][1] - point[0][1]));*/

		for (var i = P.NUMOFTRACE; i--; i > 0) {
			paper.path(getRandomSVGString());
		}
	}

	starTrace(preference);


})();