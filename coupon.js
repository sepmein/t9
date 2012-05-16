//this is the coupon app
/*
1. detect 

*/

var coupon = require('./data/coupon');

//configuration
var flow = {
	interval: 1,
	requesters: 5
};

var intervalId;

var sendCoupon = function(n) {
		console.log('Aloha! Spencer start sending coupons!!!!')
		var unsent = 0,
			count = n;
		var generate = function() {
				coupon.generate(function(status, info) {
					if (status.ok && count > 0) {
						count--;
						console.log('Yes! coupon sent to :' + info);
						//循环自调用
						generate();
					} else {
						unsent++;
						console.log(info);
					}
				});
			};
		generate();
	};

function start(flow) {
	intervalId = setInterval(function() {
		sendCoupon(flow.requesters);
	}, flow.interval * 10 * 1000);
}

function stop() {
	if (intervalId) {
		clearInterval(intervalId);
	}
}

function reStart(flow, intervalID) {
	stop();
	start(flow);
}


//unit test
/*coupon.add('emilytimi@gmail.com',function(status,err){
	if(status.ok){
		console.log('coupon added!!');
	} else {
		console.log('something failed, err : '+ err);
	}
});
*/
start(flow);
