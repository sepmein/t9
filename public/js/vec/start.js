if($('form')[0].checkValidity) {
	console.log('support checkValidity');
	$('#sub').addClass('disabled');
	$('input').keyup(function(){
		if($('form')[0].checkValidity()){
			$('#sub').removeClass('disabled');
		} else {
			$('#sub').addClass('disabled');
		}
	});
} else {
	console.log('unsupport');
}