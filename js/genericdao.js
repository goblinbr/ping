var monk = require('monk');

var genericDao = {
	newDao: function(documentName) {
		var db = monk(GLOBAL.BD_URL);
		var docName = documentName;
		var doc = db.get(docName);

		var dao = {
			getDocName: function() {
				return docName;
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
					if( returnFunction ){
						returnFunction(data);
					}
				});
			},

			removeAll: function(returnFunction) {
				doc.remove( {}, function(err, data){
					if (err) throw err;
					if( returnFunction ){
						returnFunction(data);
					}
				});
			},

			insert: function(document, returnFunction) {
				var msg = dao.validate(document, true);
				if( msg && msg != "" ){
					var err = new Error(msg);
					err.status = 400;
					throw err;
				}
				doc.insert( document, function(err, data){
					if (err) throw err;
					if( returnFunction ){
						returnFunction(data);
					}
				});
			},

			findById: function(id, returnFunction){
				doc.find({_id: id}, function(err, data, a, b){
					if (err) throw err;
					if( returnFunction ){
						returnFunction(data[0]);
					}
				});
			},

			remove: function(id, returnFunction){
				doc.remove({_id: id}, function(err, data, a, b){
					if (err) 
						throw err;
					if( returnFunction ){
						returnFunction(data[0]);
					}
				});
			},

			update: function(document, returnFunction) {
				var msg = dao.validate(document, false);
				if( msg && msg != "" ){
					var err = new Error(msg);
					err.status = 400;
					throw err;
				}
				doc.update( { _id: document._id }, document , function(err, data){
					if (err) throw err;
					if( returnFunction ){
						returnFunction(data);
					}
				});
			},

			count: function(returnFunction) {
				doc.count( {}, function(err, data){
					if (err) throw err;
					if( returnFunction ){
						returnFunction(data);
					}
				});
			},

			validate: function(document,isInsert){
				if( !isInsert ){
					if( document._id == undefined ){
						return "Documento não tem atributo _id";
					}
				}
				return "";
			}
		};

		return dao;
	}
};

module.exports = genericDao;