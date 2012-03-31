//global
var kokiya = kokiya || {};
kokiya.Post = kokiya.Post || Backbone.Model.extend({
	idAttribute: '_id',
	url: '/api/posts'
});
kokiya.PostCollection = kokiya.PostCollection || Backbone.Collection.extend({
	model: kokiya.Post,
	url: '/api/posts'
});

kokiya.PostView = kokiya.PostView || Backbone.View.extend({
	el: $('div#t'),
	template: _.template($('#post-template').html()),
	initialize: function() {
		_.bindAll(this, 'render', 'renderlist');
		if (this.model) {
			//fix no date err
			this.model.set({
				'date': new Date
			}, {
				silent: true
			});
			this.render();
		}
		if (this.collection) {
			console.log('PostView has got a collection!');
			this.collection.bind('reset', this.renderlist);
			this.collection.fetch();
		}

	},
	render: function() {
		$('#t').prepend(this.template(this.model.toJSON()));
		return this;
	},
	renderlist: function() {
		var that = this;
		console.log('renderlist called');
		this.collection.each(function(m) {
			console.log('method:each called');
			$('#t').prepend(that.template(m.toJSON()));
		});
		return this;
	}
});

kokiya.Post.Comment = kokiya.Post.Comment || Backbone.Model.extend({
	url: '/api/posts/comment',
	initialize: function() {}
});

kokiya.ServerInfo = kokiya.ServerInfo || Backbone.Model.extend({
	url: '/api/serverInfo'
});
kokiya.ServerInfoView = kokiya.ServerInfoView || Backbone.View.extend({
	initialize: function() {
		_.bindAll(this, 'render');
		//fetch在前还是format在前？
		this.model.bind('change', this.render);
	},
	render: function() {
		var fd = util.formatDate(this.model.get('upTime'));
		var fm = util.formatMemory(this.model.get('memory'));
		$('#parsedRunningTime').text(fd);
		$('#memoryUsage').text(fm);
	}
});

kokiya.Router = kokiya.Router || Backbone.Router.extend({
	routes: {
		'': 'index'
	},
	index: function() {
		console.log('index called');
		//已移交至jade
		/*
		var posts = new kokiya.PostCollection();
		var postsview = new kokiya.PostView({
			collection: posts
		});
		*/


		//------------------------------------------
		//把这项工作分配给jade
		//------------------------------------------
		var serverInfo = new kokiya.ServerInfo();
		//		console.log(serverInfo);
		var serverInfoView = new kokiya.ServerInfoView({
			model: serverInfo
		});
		serverInfo.fetch();
		$('#refreshServerInfo').click(function() {
			serverInfo.fetch();
		});

		(function() {
			var say = $('#say'),
				sayContent = $('#sayContent'),
				t = $('#t'),
				login = $('#login'),
				user = $('#user');

			var user = user.text();

			$('#say').on('click', function() {

				var content = $('#sayContent').val();
				if (!content) {
					//你的意思是沉默是金？
				} else {
					var data = {
						content: content,
						user: user
					};

					var newPost = new kokiya.Post(data);
					newPost.save();
					//clear
					$('#sayContent').val('');
				}
			});

			//使用一条jQuery语句绑定多个事件,对于一个数组中的所有元素绑定一个事件：在该元素中点击回车键，会触发紧贴该元素的下一个元素的click事件。
			$('.controls>input').keypress(function(event) {
				if (event.which === 13) {
					//console.log('Enter is clicked');
					$(this).next().trigger('click');
				}
			});

			$('#t .footer .corner').click(function() {
				$(this).parent().siblings('.comment').toggle();
			});

			$('#t .comment button').click(function() {
				var input = $(this).siblings('input.content');
				var content = input.val();
				var pid = $(this).parent().siblings('article').attr('id');
				if (content) {
					var newComment = new kokiya.Post.Comment({
						content: content,
						pid: pid
					});
					newComment.save();
					input.val('');
					$(this).parent().hide();
				} else {
					//通知用户，没有内容
				}
			});

		}());



	}
});

var app = new kokiya.Router;
Backbone.history.start();



//util
var util = util || {};
util.formatDate = function(date) {
	if (!date) {
		return "just now";
	} else {
		var TIME = {
			MONTH: 60 * 60 * 24 * 30,
			DAY: 60 * 60 * 24,
			HOUR: 60 * 60,
			MINUTE: 60
		},
			ut = date,
			month = parseInt(ut / TIME.MONTH, 10),
			day = parseInt(ut / TIME.DAY, 10),
			hour = parseInt(ut / TIME.HOUR, 10),
			minute = parseInt(ut / TIME.MINUTE, 10),
			second = parseInt(ut, 10),
			parsedRunningTime;

		if (month >= 1) {
			parsedRunningTime = month + '月';
		} else if (day >= 1) {
			parsedRunningTime = day + '天';
		} else if (hour >= 1) {
			parsedRunningTime = hour + '小时';
		} else if (minute >= 1) {
			parsedRunningTime = minute + '分钟';
		} else {
			parsedRunningTime = second + '秒，WTF，你抢到沙发了！';
		}
		parsedRunningTime += ' +';

		return parsedRunningTime;
	}
};
util.formatMemory = function(memory) {
	var m1 = parseInt(memory, 10);
	var m2 = (Math.round(m1 / 1024 / 1024 * 10)) / 10 + ' MB';
	return m2;
}
