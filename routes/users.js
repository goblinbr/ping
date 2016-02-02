var userdao = require('../js/userdao');

var users = require('./crudrouter.js');
users.setDao(userdao);
 
module.exports = users;