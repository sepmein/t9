if ($('form').length && $('form')[0].checkValidity) {
	console.log('support checkValidity');
	$('#sub').addClass('disabled');
	$('input').keyup(function() {
		if ($('form')[0].checkValidity()) {
			$('#sub').removeClass('disabled');
		} else {
			$('#sub').addClass('disabled');
		}
	});
} else {
	console.log('unsupport');
}

//fancy logo!!
(function() {
	var holder = document.getElementById('holder');
	var paper = Raphael(holder, 600, 120);
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
	var subtitle = paper.text(375, 76, 'hands-free').attr({
		'font-size': '60px',
		'font-family': 'Helvetica Neue',
		'font-weight': '100',
		'fill': 'rgb(125,125,125)',
		opacity: 0
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
		}, 5000, function() {
			subtitle.animate({
				opacity: 1
			}, 300);
		});
	}, 500);
})();