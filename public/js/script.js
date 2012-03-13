var say = $('#say'),
	sayContent = $('#sayContent'),
	chatboard = $('#chatboard'),
	login = $('#login'),
	userName = $('#userName');


//simple constructor for message
var Message = function(content, timeStamp) {
		this.content = content;
		this.timeStamp = timeStamp;
	};
var user = '';

var socket = io.connect('http://kokiya.no.de');

//将返回数据解析成html，这个部分应该就是传说中的view了，应该想办法把它抽象化。
function getView(object){
	return $('<div class="post post-type-large"><div class="corner comment"><i class="icon-comment"></i></div><div class="corner plus"><i class="icon-plus"></i></div><div class="corner minus"><i class="icon-minus"></i></div><article id="'
			+object._id
			+'"><section class="bio"><img src="img/avatar.png" alt="You"></section><strong class="user">'
	        +object.user
	        +' : </strong><br /><small>'
        	+object.message.timeStamp
        	+'</small><p class="content">'
        	+object.message.content
        	+'</p></article><div class="clear"></div></div>'
        	);
}
function getComments(object){
	return $();
}

//onConnection
socket.on('newComer', function(data) {
	//for test
	//console.log(data);


	data.forEach(function(element, index, array) {
		chatboard.append(getView(element));
	});
	commentsBindClick();
	mans();

});

//get server running time and display
socket.on('serverInfo',function(data){
	//console.log('server returned '+ data);
	//console.log(data.upTime);
	
	//时间计算
	var TIME = {
			MONTH : 60*60*24*30,
			DAY : 60*60*24,
			HOUR : 60*60,
			MINUTE : 60
		},
		ut 		= data.upTime,
		month	= parseInt(ut/TIME.MONTH, 10),
		day		= parseInt(ut/TIME.DAY, 10),
		hour	= parseInt(ut/TIME.HOUR, 10),
		minute	= parseInt(ut/TIME.MINUTE, 10),
		second 	= parseInt(ut, 10),
		parsedRunningTime;

	if(month >= 1){
		parsedRunningTime = month + '月';
	} else if(day >= 1) {
		parsedRunningTime = day + '天';
	} else if(hour >= 1) {
		parsedRunningTime = hour + '小时';
	} else if(minute >= 1) {
		parsedRunningTime = minute + '分钟';
	} else {
		parsedRunningTime = second + '秒，WTF，你抢到沙发了！';
	}

	parsedRunningTime += ' +';
	$('#parsedRunningTime').text(parsedRunningTime);
	//console.log('parsed '+ parsedRunningTime);

	//处理内存
	var mm = (Math.round(data.memory/1024/1024*10))/10 + ' MB';
	//console.log(mm);
	$('#memoryUsage').text(mm);
});

//say something
//get DOM
//login
$('#login').click(function() {
	//check empty
	if ($('#userName').val()) {
		user = $('#userName').val();

		socket.emit('login', user);
		//clear
		$('#userName').val('');
	}
});
//listen to log event
socket.on('loginSuccess', function() {
	//	console.log('loginSuccess');
	$('#controller>.hiddenFrame').animate({
		top: '-46px'
	}, function() {
		//焦点移至发言框
		$('#sayContent').focus();
	});
	$('#controller .userName').text(user + ' : ');

});

$('#say').on('click', function() {

	var content = $('#sayContent').val();

	//修正不同浏览器返回时间不正常的情况，暂停使用，存储到db中使用raw Date
	/*var parsedDate = function(d) {

		function addZero(to) {
			//对于分钟和秒都在前面加个零符合人类的视觉需求
			return (to < 10) ? ('0' + to) : to;
		}

		var result = (d.getMonth() + 1) + '月' + d.getDate() + '日' + ' , ' + d.getHours() + ':' + addZero(d.getMinutes()) + ':' + addZero(d.getSeconds());
		return result;
	}(date);*/

	var sbdSaySth = {
		user: user,
		content: content
	};

	socket.emit('say', sbdSaySth);
	//clear
	$('#sayContent').val('');

});

//使用一条jQuery语句绑定多个事件,对于一个数组中的所有元素绑定一个事件：在该元素中点击回车键，会触发紧贴该元素的下一个元素的click事件。
$('.controls>input').keypress(function(event) {
	if (event.which === 13) {
		//console.log('Enter is clicked');
		$(this).next().trigger('click');
	}
});
$('#sayContent').change(function() {
	console.log('change event trigger');
});

//点击comments图标跳出comments文本框
function commentsBindClick(){
	$('#chatboard i').click(function(){
		$(this).next().toggle();
	});
}

//超过16个字的话输入框变长，目前还未检测输入内容是否是中英文
/*if($(this).val().length>16) {
	//console.log('triggered');
	//2console.log($(this).val().length);
	$(this).css('width','400px');
} 
*/

socket.on('loginFailure', function() {
	//	console.log('loginFailure');
	$('.alert').show('medium').delay(2000).hide('medium');
	user = '';
});

//got something new
socket.on('newMessage', function(data) {
	if (chatboard.children().length >= 20) {
		//remove chatboard's first child
		$('#chatboard').children(':last').remove();
	}
	//view
	chatboard.prepend(getView(data)).masonry( 'reload');
	commentsBindClick();
});



//masonry
function mans(){
	var $container = $('#chatboard');
	$container.masonry({
	    itemSelector : '.post',
	    columnWidth : 30,
		isAnimated: true,
		isResizable: true,
	  	animationOptions: {
		    duration: 400,
		    easing: 'linear',
		    queue: false
		}
	});
}