exports.index = function(req, res) {
	if (req.session.user) {
		res.redirect('/index.html');
	} else {
		res.render('index', {
			title: 'KOKIYA'
		});
	}
};

exports.register = function(req, res) {
	//验证，成功后在db增加记录，失败后重定向至首页
	res.redirect('/');
};
