var util = {};
util.validateEmail = function(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

(function() {
	//验证成功则使button亮起，否则无法requireCoupon
	$('#email').keyup(function() {
		var t = util.validateEmail($(this).value);
		if (t) {
			$(this).removeclass('wrongAddress');
		} else {
			$(this).addClass('wrongAddress');
		}
	});

	$('#sendEmailAddress').click(function() {
		//changed to sending state
		var email = $('#email').value;
		$('#sendEmailAddress').text('Sending');
		$.post('/requireCoupon', email, function(data) {
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
				$('#sendEmailAddress').text('加入队列');
				//display err
			}
		});
	});
})();
