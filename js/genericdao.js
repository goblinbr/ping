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

			findAll: function(page,docsPerPage,next) {
				var options = {};
				if( page > 0 && docsPerPage > 0 ){
					options.limit = docsPerPage;
					options.skip = (page - 1) * docsPerPage;
				}

				doc.find({}, options, next);
			},

			deleteAll: function(next) {
				doc.remove( {}, next);
			},

			insert: function(document, next) {
				var msg = dao.validate(document, true);
				if( msg && msg != "" ){
					var err = new Error(msg);
					err.status = 400;
					next(err);
				}
				else{
					doc.insert( document, next );
				}
			},

			findById: function(id, next){
				doc.findOne({_id: id}, next);
			},

			delete: function(id, next){
				doc.remove({_id: id}, next);
			},

			update: function(document, next) {
				var msg = dao.validate(document, false);
				if( msg && msg != "" ){
					var err = new Error(msg);
					err.status = 400;
					next(err);
				}
				else{
					doc.update( { _id: document._id }, document , next);
				}
			},

			count: function(next) {
				doc.count( {}, next);
			},

			validate: function(document,isInsert){
				if( !isInsert ){
					if( document._id == undefined ){
						return "missing_id_to_update";
					}
				}
				return "";
			}
		};

		return dao;
	}
};

module.exports = genericDao;