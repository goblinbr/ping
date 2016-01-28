function UserDao() {
	var monk = require('monk');
	var db = monk(GLOBAL.BD_URL);
	var doc = db.get('user');

	this.findAll = function(returnFunction) {
		doc.find({}, function(err, data){
			if (err) throw err;
			returnFunction(data);
		});
	};

	this.removeAll = function(returnFunction) {
		doc.remove( {}, function(err, data){
			if (err) throw err;
			returnFunction(data);
		});
	};

	this.insert = function(document, returnFunction) {
		doc.insert( document, function(err, data){
			if (err) throw err;
			returnFunction(data);
		});
	};

	this.findById = function(id, returnFunction){
		doc.find({_id: id}, function(err, data, a, b){
			if (err) throw err;
			returnFunction(data[0]);
		});
	};
}

module.exports = new UserDao();