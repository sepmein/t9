(function() {
	var holder = document.getElementById('holder');
	var paper = Raphael(holder, 300, 200);
	paper.customAttributes.along = function(a) {
		return {
			path: logo.getSubpath(0, a)
		};
	};
	var set = paper.set();
	var logo = paper.path('M10 10L45 100L80 10M140 12A44 44 0 1 0 140 98M87 55H250M210 12A44 44 0 1 0 210 98').attr({
		opacity: 0,
		stroke: 'rgb(100,100,100)'
	});
	var c = paper.path().attr({
		along: 0,
		'stroke-width': '2',
		stroke: 'rgb(100,100,100)'
	});
	paper.rect(0, 0, 600, 120).attr({
		fill: '#000',
		opacity: 0,
		href: '/vec',
		cursor: 'point'
	});

	function logoAnimation() {

	}
	setTimeout(function() {
		c.animate({
			along: logo.getTotalLength()
		}, 5000);
	}, 500);
})();