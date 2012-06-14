(function() {
	var holder = document.getElementById('holder');
	var paper = Raphael(holder, 600, 600);
	/*	var circle = paper.circle(0, 0, 50);
	var path = paper.path('m50,50c0,40,50,40,50,0');
	var path1 = paper.path('m50,100s25,70,50,0');
	var path2 = paper.path('m50,150q25,70,50,0');
	var path3 = paper.path('m50,200t50,0t0,50z');
	var e = paper.path('m50,300a50,50,0,0,1,100,0');*/
	var static = {
		P: [300, 300],
		ALPHA: 30,
		MAXRANGE: 300
	};

	function getCoords(origin, degree, distance) {
		var coords = [];
	    var radians = (degree/180) * Math.PI;
		coords[0] = origin[0] + Math.cos(radians) * distance;
		coords[1] = origin[1] + Math.sin(radians) * distance;
		return coords;
	}
	//testing
	console.log(getCoords([300, 300], 30, 200));
	var point = [getCoords([300, 300], 3.14, 200) , getCoords([300, 300], 0, 200)]
	paper.path('m' + static.P[0] + ',' + static.P[0] +'l'+point[0][0]+','+point[0][1]);
})();