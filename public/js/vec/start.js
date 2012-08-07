if ($('form')[0].checkValidity) {
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
	paper.path('M10 10L45 100L80 10M140 12A44 44 0 1 0 140 98M87 55H250M210 12A44 44 0 1 0 210 98').attr({
		'stroke-width' : '2'
	});
	var subtitle = paper.text(355,75,'hands-free').attr({
		'font-size': '50px',
		'font-family':  'Helvetica Neue',
		'font-weight': '100'
	});
})();