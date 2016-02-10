var hostdao = require('../js/hostdao.js');

var hosts = require('./crudrouter.js').newRouter(hostdao);

var superInsert = hosts.insert;

hosts.insert = function(req, res) {
	var host = req.body;
	var user = req.user;

	if( !host.userId ){
		host.userId = user._id.toString();
	}

	if( user._id != host.userId && user.role != 'admin' ){
		var err = new Error("Usuário inválido para o host!");
		err.status = 400;
		throw err;
	}
	
	superInsert(req,res);
};

var superUpdate = hosts.update;

hosts.update = function(req, res) {
	var host = req.body;
	var user = req.user;

	if( user._id != host.userId && user.role != 'admin' ){
		var err = new Error("Usuário inválido para o host!");
		err.status = 400;
		throw err;
	}
	
	superUpdate(req,res);
};

hosts.findAllByUser = function(req, res) {
	var user = req.user;
	hosts.getDao().findAllByUser(user._id.toString(), function(data){
		res.json(data);
	});
};
 
module.exports = hosts;