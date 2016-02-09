var hostdao = require('../js/hostdao.js');

var hosts = require('./crudrouter.js').newRouter(hostdao);

var superInsert = hosts.insert;

hosts.insert = function(req, res) {
	var host = req.body;
	var user = req.user;

	if( user._id != host.userId && user.role != 'admin' ){
		var err = new Error("Usuário inválido para o host!");
		err.status = 500; // TODO: Verify status code
		throw err;
	}
	
	superInsert(req,res);
};

hosts.findAllByUser = function(req, res) {
	var user = req.user;
	hosts.getDao().findAllByUser(user._id, function(data){
		res.json(data);
	});
};
 
module.exports = hosts;