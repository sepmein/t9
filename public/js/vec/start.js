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
	var paper = Raphael(holder, 300, 150);
	paper.customAttributes.along = function(a) {
		return {
			path: logo.getSubpath(0, a)
		};
	};
	var set = paper.set();
	var logo = paper.path('M40 10L75 100L120 10M170 12A44 44 0 1 0 170 98M117 55H280M240 12A44 44 0 1 0 240 98').attr({
		opacity: 0,
		stroke: 'rgb(100,100,100)'
	});
	var c = paper.path().attr({
		along: 0,
		'stroke-width': '5',
		stroke: '#268ABB'
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
		}, 5000,function(){
			$('p.speech').show('fast');
		});
	}, 500);
})();