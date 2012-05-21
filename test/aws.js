var ses = require('aws2js').load('ses','AKIAIJPR3I4SKD4I2NHQ','AuWUz9vVb63rwC4guRZVtE6yO2kVihX6BS7rjf0uPlYt');

ses.request('ListVerifiedEmailAddresses',{},function(err,response){
	if(!err) {
		console.dir(response);
	} else {
		
		console.error(err);
	}
});

ses.getEndPoint();