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
		var t = util.validateEmail(email);
		if (t) {
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
					//display err
					$('#errMessage').text(data.err).show(300).delay(2000).hide(200);
				};
			});
		} else {
			$('#errMessage').text('Email地址错误，请检查').show(300).delay(2000).hide(200);
		}
	});
})();
