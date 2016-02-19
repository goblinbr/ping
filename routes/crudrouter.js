var handleErrorGlobal = require('../handle-error');

var crudRouter = {

	newRouter: function(genericdao) {
		var dao = genericdao;

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
				dao.insert(newDocument, function(err,data){
					if( router.handleError(err, req, res) ){
						res.json(data);
					}
				});
			},

			update: function(req, res) {
				var updateDocument = req.body;
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