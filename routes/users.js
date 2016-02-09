var userdao = require('../js/userdao');

var users = require('./crudrouter.js').newRouter(userdao);
 
module.exports = users;