var say = $("#say"),
	sayContent = $('#sayContent'),
	chatboard = $('#chatboard'),
	login = $('#login'),
	userName = $('#userName');


//simple constructor for message
var Message = function(content,timeStamp){
  this.content = content;
  this.timeStamp = timeStamp;
};
var user = "";

var socket = io.connect('http://kokiya.no.de');
//onConnection
socket.on('newComer', function (data) {
	
	data.forEach(function(element,index,array){
		chatboard.append($("<p>"+element.user+" : "+element.message.content+"<small>  @ "+element.message.timeStamp+"</small></p>"));
	});

});

//say something

//get DOM

//login
$('#login').click(function(){
	//check empty
	if($('#userName').val()){
		user = $('#userName').val();

		socket.emit('login', user);
		//clear
		$('#userName').val('');
	}
});
//listen to log event
socket.on('loginSuccess',function(){
//	console.log('loginSuccess');
	$('#userName').attr({
		id : 'sayContent',
		placeholder : '输入内容',
		name : 'sayContent'
	});
	$('#login').text('Enter');
	$('#login').removeClass('btn-danger').addClass('btn-primary');
	$('#login').attr({
		id : 'say'
	}).unbind('click').on('click',function(){

		var content = $('#sayContent').val(),
			date = new Date().toLocaleString();

		var saySth = new Message(content,date);
		var sbdSaySth = {	user:user,
							message:saySth
						};

		socket.emit('say', sbdSaySth);
		//clear
		$('#sayContent').val('');

	});

});
socket.on('loginFailure',function(){
//	console.log('loginFailure');
	$('.alert').show('medium').delay(2000).hide('medium');
	user = "";
});

//manipulate dom when success or failure




//got something new

socket.on('newMessage',function (data) {
	if(chatboard.children().length >= 20) {
		//remove chatboard's first child
		$("#chatboard").children(':first').remove();
	}
	chatboard.append($("<p>"+data.user+" : "+data.message.content+"<small>  @ "+data.message.timeStamp+"</small></p>"));

});


//exit
/*$(window).unload(function() {
  socket.emit('exit',user);
});*/