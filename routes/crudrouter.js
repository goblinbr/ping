var handleErrorGlobal = require('../handle-error');
var moment = require('moment');

var dateFormats = [
	moment.ISO_8601,
	"YYYY/MM/DD",
	"YYYY/MM/DD HH:mm:ss"
];

var crudRouter = {

	newRouter: function(genericdao) {
		var dao = genericdao;

		var transformFields = function(document) {
			for(var attribute in document){
				var value = document[attribute];
				if( !(value instanceof Date) ){
					var momentDate = moment(value, dateFormats, true);
					if( momentDate.isValid() ){
						console.log( "parsing " + attribute + " : " + value + " to date " + momentDate.format() );
						document[attribute] = momentDate.toDate();
					}
				}
			}
		};

		var router = {
			handleError: handleErrorGlobal,

			getDao: function() {
				return dao;
			},

			findAll: function(req, res) {
				dao.findAll(req.params.page, req.params.docsPerPage, function(err,data){
					if( router.handleError(err, req, res) ){
						res.json(data);
					}
				});
			},

			find: function(req, res) {
				dao.find(req.params.id, function(err,data){
					if( router.handleError(err, req, res) ){
						res.json(data);
					}
				});
			},

			insert: function(req, res) {
				var newDocument = req.body;
				transformFields( newDocument );
				dao.insert(newDocument, function(err,data){
					if( router.handleError(err, req, res) ){
						res.json(data);
					}
				});
			},

			update: function(req, res) {
				var updateDocument = req.body;
				transformFields( updateDocument );
				dao.update(updateDocument, function(err,data){
					if( router.handleError(err, req, res) ){
						res.json(data);
					}
				});
			},

			delete: function(req, res) {
				var id = req.params.id;
				dao.delete(id, function(err,data){
					if( router.handleError(err, req, res) ){
						res.json(data);
					}
				});
			}
		}

		return router;
	}
};

module.exports = crudRouter;