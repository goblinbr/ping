var dao = {};

var router = {

  setDao: function(genericdao) {
    dao = genericdao;
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
    var newUser = req.body;
    dao.insert(newUser, function(data){
      res.json(data);
    });
  },
 
  update: function(req, res) {
    var updateUser = req.body;
    dao.insert(updateUser, function(data){
      res.json(data);
    });
  },
 
  delete: function(req, res) {
    var id = req.params.id;
    dao.delete(id, function(data){
      res.json(data);
    });
  }
};

module.exports = router;