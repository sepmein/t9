(function() {
	var href = window.location.href;
	$('#url').attr('href', href).html(href);

	$('#send').submit(function(event) {
		event.preventDefault();
		var to = $('#sendTo').val();
		$.post('/vec/sendUrl',{
			to: to,
			url: href
		},function(data){
			if(data.status) {
				//show success info
				console.log('success');
				$('#sendTo').val('发送成功');
			} else {
				//show failure info
				console.log(data.info);
				$('#errMessage').text(data.err).show(300).delay(2000).hide(200);
			}
		});
	});
})();