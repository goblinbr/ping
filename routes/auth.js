var jwt = require('jwt-simple');
var userdao = require('../js/userdao');

var auth = {
	login: function(req, res) {
		var username = (req.body) ? req.body.username : req.query.username;
		var password = (req.body) ? req.body.password : req.query.password;

		if (username == '' || password == '') {
			res.status(401);
			res.json({
				"status": 401,
				"message": "Invalid credentials"
			});
		}
		else{
			auth.validate(username, password, function(dbUserObj){
				if (dbUserObj) {
					res.json(genToken(dbUserObj));
				}
				else{
					res.status(401);
					res.json({
						"status": 401,
						"message": "Invalid credentials"
					});
				}
			});
		}
	},

	createAccount: function(req, res) {
		var user = (req.body) ? req.body.user : undefined;

		if (user) {
			userdao.insert(user, function(dbUserObj){
				if (dbUserObj) {
					res.json(genToken(dbUserObj));
				}
				else{
					res.status(401); // TODO: Verify status code
					res.json({
						"status": 401,
						"message": "Invalid User"
					});
				}
			});
		}
		else{
			res.status(401); // TODO: Verify status code
			res.json({
				"status": 401,
				"message": "Invalid User"
			});
		}
	},

	validate: function(email, password, returnFunction) {
		userdao.findByEmail(email, function(user){
			if( user ){
				if( user.password != password ){ // TODO: encrypt password
					user = undefined;
				}

				if( user ){
					delete user.password;
				}
			}
			returnFunction(user);
		});
	},

	validateUser: function(email, returnFunction) {
		userdao.findByEmail(email, function(user){
			if( user ){
				delete user.password;
			}
			returnFunction(user);
		});
	},

	validateRequest: function(req, res, next) {
		var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
		//var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

		if (token) {
			var decoded = undefined;
			try{
				decoded = jwt.decode(token, require('../config/secret.js')());
			}
			catch(err){
				//console.log("Invalid token: " + token);
			}
			if (decoded){
				if (decoded.exp <= Date.now()) {
					res.status(400);
					res.json({
						"status": 400,
						"message": "Token Expired"
					});
					return;
				}

				// Authorize the user to see if s/he can access our resources
				auth.validateUser(decoded.email, function(dbUser){
					if (dbUser) {
						if ((req.url.indexOf('admin') >= 0 && dbUser.role == 'admin') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/') >= 0)) {
							req.user = dbUser;
							next();
						}
						else {
							res.status(403);
							res.json({
								"status": 403,
								"message": "Not Authorized"
							});
						}
					}
					else {
						// No user with this name exists, respond back with a 401
						res.status(401);
						res.json({
							"status": 401,
							"message": "Invalid User"
						});
					}
				});
			}
			else{
				res.status(401);
				res.json({
					"status": 401,
					"message": "Invalid Token"
				});
			}
		}
		else {
			res.status(401);
			res.json({
				"status": 401,
				"message": "Invalid Token"
			});
		}
	}
}

function genToken(user) {
	var expires = expiresIn(7); // 7 days
	var decodedToken = {
		exp: expires,
		email: user.email
	};
	var token = jwt.encode(decodedToken, require('../config/secret')());

	return {
		token: token,
		expires: expires,
		user: user
	};
}

function expiresIn(numDays) {
	var dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;