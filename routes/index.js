var express = require('express');
var router = express.Router();
 
var auth = require('./auth.js');
var hosts = require('./hosts.js');
var users = require('./users.js');
 
/*
 * Routes that can be accessed by any one
 */
router.get('/login', auth.login);
router.post('/login', auth.login);
 
/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/api/hosts/:page/:docsPerPage', hosts.findAll);
router.get('/api/hosts/:id', hosts.find);
router.post('/api/hosts/', hosts.insert);
router.put('/api/hosts/', hosts.update);
router.delete('/api/hosts/:id', hosts.delete);
 
/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get('/api/admin/users/:page/:docsPerPage', users.findAll);
router.get('/api/admin/user/:id', users.find);
router.post('/api/admin/user/', users.insert);
router.put('/api/admin/user/', users.update);
router.delete('/api/admin/user/:id', users.delete);
 
module.exports = router;