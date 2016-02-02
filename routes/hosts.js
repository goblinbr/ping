var hostdao = require('../js/hostdao.js');

var hosts = require('./crudrouter.js');
hosts.setDao(hostdao);
 
module.exports = hosts;