(function() {

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

	$('#sub').click(function() {
		$('form')[0].checkValidity();
		if (!$('#sub').hasClass('disabled')) {
			$('#alert').modal({
				'backdrop': 1,
				'keyboard': 1
			});
		}
	});

})();