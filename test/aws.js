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
	'Destination.ToAddresses.member.1': 'emilytimi@gmail.com',
	'Message.Body.Html.Data': '<h1>From Amazon SES小广告系统</h1><p>再发一封</p>',
	'Message.Subject.Data': '老娘睡着了',
	'Source': "sepmein@gmail.com"
}, function(err, response) {
	if (!err) {
		console.dir(response);
	} else {
		console.error(err);
	}
});