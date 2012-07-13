var coupon = require('./data/coupons');

var request = "sepmein@gmail.com";

//unit test
coupon.add('emilytimi@gmail.com',function(status,err){
	if(status.ok){
		console.log('coupon added!!');
	} else {
		console.log('something failed, err : '+ err);
	}
});

start(flow);