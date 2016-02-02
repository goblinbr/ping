var _global = require('./global');
var assert = require('assert');

var auth = require('../routes/auth');
var userdao = require('../js/userdao');

describe('auth', function(){
	var user = {name: "Rodrigo de Bona Sartor", email: "xxx@gmail.com", password: "abcd1234", active: "Y", timezone: "-3", token: "ABC-0123-ASDASD"};

	before(function(done){
		userdao.removeAll(function () {
			userdao.insert( user, function(){
				done();
			} );
		});
	})

	it('validate with unknow user', function(done){
		auth.validate( "asdkasd@klaskd.com", "lkaslkdlkaslkd", function(returnedUser){
			assert.equal(returnedUser,undefined);
			done();
		} );
	});

	it('validate with wrong password', function(done){
		auth.validate( user.email, "lkaslkdlkaslkd", function(returnedUser){
			assert.equal(returnedUser,undefined);
			done();
		} );
	});

	it('validate with right password', function(done){
		auth.validate( user.email, user.password, function(returnedUser){
			assert.equal(returnedUser.name,user.name);
			done();
		} );
	});

	it('login with right password', function(done){
		var request = {
			body: {
				username: user.email,
				password: user.password
			}
		};

		var statusCode = 0;

		var response = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				assert.equal(data.user.name,user.name);
				done();
			}
		};

		auth.login( request, response );
	});

	it('login with wrong password', function(done){
		var request = {
			body: {
				username: user.email,
				password: "kasldkalsdlas"
			}
		};

		var statusCode = 0;

		var response = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				assert.equal(statusCode,401);
				done();
			}
		};

		auth.login( request, response );
	});

	it('validateRequest without token', function(done){
		var request = {
			headers: {}
		};

		var statusCode = 0;

		var response = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				assert.equal(statusCode,401);
				done();
			}
		};

		auth.validateRequest( request, response );
	});

	it('validateRequest with invalid token', function(done){
		var request = {
			headers: {
				'x-access-token': 'adakjsdjaksd-12321mkasjdfaxxx'
			}
		};

		var statusCode = 0;

		var response = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				assert.equal(statusCode,401);
				done();
			}
		};

		auth.validateRequest( request, response );
	});

	it('validateRequest with valid token', function(done){
		var loginRequest = {
			body: {
				username: user.email,
				password: user.password
			}
		};

		var loginResponse = {
			status: function(st){
			},

			json: function(data){

				var validateRequest = {
					headers: {
						'x-access-token': data.token
					},

					url: '/api/hosts/1/10'
				};

				var next = done;

				var validateResponse = {
					status: function(st){
					},

					json: function(data){
						assert.fail(data,'undefined','wrong request validation, should pass');
						done();
					}
				};

				auth.validateRequest( validateRequest, validateResponse, next );
			}
		};

		auth.login( loginRequest, loginResponse );
	});
})
