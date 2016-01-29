var express = require('express');
var router = express.Router();
var userdao = require('../js/userdao');

/* GET users listing. */
router.get('/:page/:docsPerPage', function(req, res) {
    userdao.findAll(req.params.page, req.params.docsPerPage, function(data){
    	res.json(data);
    });
});

module.exports = router;
