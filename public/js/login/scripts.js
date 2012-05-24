var button = button || {};
button.listen = function(btn, fn) {
	//btn jquery obj, fn function
	btn.click(fn);
};

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
		$.post('/requireCoupon', function() {

		});
		changeButtonStateToSending();
		sendEmailAddress();
		waitingForResult(function(result) {
			if (result) {
				//success
				display(success);
			} else {
				//fail
				display(fail);
			}
		});
	});
})();
