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

var socket = io.connect('http://localhost:8080');
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
	$('#controller>.hiddenFrame').animate({top : "-46px"},function(){
		$('#sayContent').focus();
	});
	$('#controller .userName').text(user + " : ");
	//焦点移到发言框
	//

});

$('#say').on('click',function(){

	var content = $('#sayContent').val(),
		date = new Date();

	//修正不同浏览器返回时间不正常的情况
	var	parsedDate = function(d){

			function addZero(to){
				//对于分钟和秒都在前面加个零符合人类的视觉需求
				return (to<10)?('0'+to):to;
			}

			var result = (d.getMonth()+1)+ '月'+ d.getDate()+ '日'+' , '+d.getHours() + ':' + addZero(d.getMinutes()) + ':' +addZero(d.getSeconds());
			return result;
		}(date);

	var saySth = new Message(content,parsedDate);
	var sbdSaySth = {	user:user,
						message:saySth
					};

	socket.emit('say', sbdSaySth);
	//clear
	$('#sayContent').val('');

});

//键盘回车，出发say的click事件
//$('#sayContent').keypress(function(e){
//	console.log(e);
//	if(e.which === 13) {
//		console.log('Enter is clicked');
//		$('#say').trigger('click');
//	}
//});

//使用一条jQuery语句绑定多个事件,对于一个数组中的所有元素绑定一个事件：在该元素中点击回车键，会触发紧贴该元素的下一个元素的click事件。
$('.controls>input').keypress(function(event){
		if(event.which === 13) {
			//console.log('Enter is clicked');
			$(this).next().trigger('click');
		}
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
