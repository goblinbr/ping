var userdao = require('../js/dao/userdao');

var users = require('./crudrouter.js').newRouter(userdao);
 
module.exports = users;