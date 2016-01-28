var express = require('express');
var router = express.Router();
var userdao = require('../js/userdao');

/* GET users listing. */
router.get('/', function(req, res) {
    userdao.findAll(function(data){
    	res.json(data);
    });
});

module.exports = router;
