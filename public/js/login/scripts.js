var util = {};
util.validateEmail = function(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

(function() {
	//验证成功则使button亮起，否则无法requireCoupon
	$('#email').keyup(function() {
		console.log($(this).val());
		var t = util.validateEmail($(this).val());
		if (t) {
			$(this).removeClass('wrongAddress');
		} else {
			$(this).addClass('wrongAddress');
		}
	});

	$('#sendEmailAddress').click(function() {
		event.preventDefault();
		//changed to sending state
		var email = $('#email').val();
		$('#sendEmailAddress').text('Sending');
		$.post('/requireCoupon', {
			email: email
		}, function(data) {
			/*
				data structure
				{
					ok:bool,
					err:string
				}
			*/
			if (data.ok) {
				$('#sendEmailAddress').text('成功加入队列');
			} else {
				$('#sendEmailAddress').text('失败').addClass('btn-warning');
				//display err
				$('#errMessage').text(data.err).show(1000, function() {
					$('#sendEmailAddress').text('加入队列').removeClass('btn-warning');
					$('#errMessage').hide(300);
				});
			}
		});
	});
})();
