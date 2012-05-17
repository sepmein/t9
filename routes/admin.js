var requireAdmin = require('.././middleware').requireAdmin;
var handleAdmin = require('.././handlers/admin.js');

module.exports = function(app) {
	app.get('/admin', requireAdmin, handleAdmin.get);
};
