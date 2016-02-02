var monk = require('monk');
var db = monk(GLOBAL.BD_URL);
var doc = {};


var genericDao = {

	setDocName: function(docName) {
		doc = db.get(docName);
	},

	getDoc: function() {
		return doc;
	},

	findAll: function(page,docsPerPage,returnFunction) {
		var options = {};
		if( page > 0 && docsPerPage > 0 ){
			options.limit = docsPerPage;
			options.skip = (page - 1) * docsPerPage;
		}

		doc.find({}, options, function(err, data){
			if (err) throw err;
			returnFunction(data);
		});
	},

	removeAll: function(returnFunction) {
		doc.remove( {}, function(err, data){
			if (err) throw err;
			returnFunction(data);
		});
	},

	insert: function(document, returnFunction) {
		doc.insert( document, function(err, data){
			if (err) throw err;
			returnFunction(data);
		});
	},

	findById: function(id, returnFunction){
		doc.find({_id: id}, function(err, data, a, b){
			if (err) throw err;
			returnFunction(data[0]);
		});
	},

	remove: function(id, returnFunction){
		doc.remove({_id: id}, function(err, data, a, b){
			if (err) throw err;
			returnFunction(data[0]);
		});
	},

	update: function(document, returnFunction) {
		doc.update( { _id: document._id }, document , function(err, data){
			if (err) throw err;
			returnFunction(data);
		});
	},

	count: function(returnFunction) {
		doc.count( {}, function(err, data){
			if (err) throw err;
			returnFunction(data);
		});
	}
};

module.exports = genericDao;