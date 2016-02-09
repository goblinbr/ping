var hostdao = require('./js/hostdao');
var userdao = require('./js/userdao');

var mod = {
	init: function() {
		//userdao.removeAll();
		hostdao.removeAll();
	}	
};

module.exports = mod;