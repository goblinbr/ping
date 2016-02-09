var crudRouter = {

	newRouter: function(genericdao) {
		var dao = genericdao;

		var router = {
			getDao: function() {
				return dao;
			},

			findAll: function(req, res) {
				dao.findAll(req.params.page, req.params.docsPerPage, function(data){
					res.json(data);
				});
			},

			find: function(req, res) {
				dao.find(req.params.id, function(data){
					res.json(data);
				});
			},

			insert: function(req, res) {
				var newDocument = req.body;
				dao.insert(newDocument, function(data){
					res.json(data);
				});
			},

			update: function(req, res) {
				var updateDocument = req.body;
				dao.insert(updateDocument, function(data){
					res.json(data);
				});
			},

			delete: function(req, res) {
				var id = req.params.id;
				dao.delete(id, function(data){
					res.json(data);
				});
			}
		}

		return router;
	}
};

module.exports = crudRouter;