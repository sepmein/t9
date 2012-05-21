var ses = require('aws2js').load('ses', 'AKIAIBEFEBQPBURFZBHQ', 'LP+3Hme+TgYrYTW7ccOphS9sdXDvNPBqMH8cyRP9');

/*
ses.request('GetSendQuota',{},function(err,response){
	if(!err) {
		console.dir(response);
	} else {
		
		console.error(err);
	}
});
*/

ses.request('SendEmail', {
	'Destination.ToAddresses.member.1': 'crimde@gmail.com',
	'Message.Body.Text.Data': 'From Amazon SES小广告系统',
	'Message.Subject.Data': 'hihi',
	'Source': "sepmein@gmail.com"
}, function(err, response) {
	if (!err) {
		console.dir(response);
	} else {
		console.error(err);
	}
});