var handlers = require('.././handlers');

exports.index = function(req, res) {
	if (req.session.uid) {
			handlers.renderById(req.session.uid, function(koki) {
				res.render('index', {
				locals: {
					data: koki
				}
			});
		});
	} else {
		res.redirect('login', {
			layout: false
		});
	}
};

exports.register = function(req, res) {
	//验证，成功后在db增加记录，失败后重定向至首页
	res.redirect('/');
};
