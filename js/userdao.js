var dao = require('./genericdao');

dao.setDocName( 'user' );

dao.findByEmail = function (email, returnFunction) {
	var doc = dao.getDoc();
	doc.find({email: email}, function(err, data, a, b){
		if (err) throw err;
		returnFunction(data[0]);
	});
};

module.exports = dao;