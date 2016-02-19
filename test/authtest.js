var _global = require('./global');
var assert = require('assert');

var auth = require('../routes/auth');
var userdao = require('../js/userdao');

describe('routes/auth', function(){
	var user = {name: "User X", email: "mkasdkmaskd@gmail.com", password: "abcd1234", active: "Y", timeZone: "America/Sao_Paulo", token: "ABC-0123-ASDASD"};

	before(function(done){
		userdao.deleteAll(function () {
			userdao.insert( user, function(){
				done();
			} );
		});
	})

	it('validate with unknow user', function(done){
		auth.validate( "asdkasd@klaskd.com", "lkaslkdlkaslkd", function(err, returnedUser){
			assert.equal(returnedUser,undefined);
			done();
		} );
	});

	it('validate with wrong password', function(done){
		auth.validate( user.email, "lkaslkdlkaslkd", function(err, returnedUser){
			assert.equal(returnedUser,undefined);
			done();
		} );
	});

	it('validate with right password', function(done){
		auth.validate( user.email, user.password, function(err, returnedUser){
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

		auth.validateRequest( request, response, function(){
			assert.fail('wrong request validation, should not pass');
			done();
		} );
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


	it('createAccount with valid user', function(done){
		var validUser = {name: "User X", email: "xxx@gmail.com", password: "abcd1234", active: "Y", timeZone: "America/Sao_Paulo", token: "ABC-0123-ASDASD"};

		var request = {
			body: {
				user: validUser
			}
		};
		var statusCode = 0;
		var response = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				assert.equal(data.user.name,validUser.name);
				done();
			}
		};

		auth.createAccount( request, response );
	});

	it('createAccount with invalid user', function(done){
		var invalidUser = {};

		var request = {
			body: {
				user: invalidUser
			}
		};
		var statusCode = 0;
		var response = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				assert.equal(statusCode,400);
				done();
			}
		};
		
		auth.createAccount( request, response );
	});

	it('createAccount 2 accounts with the same email', function(done){
		var user1 = {name: "User 1", email: "xxx@gmail.com", password: "abcd1234", active: "Y", timeZone: "America/Sao_Paulo"};
		var user2 = {name: "User 2", email: "xxx@gmail.com", password: "12312asd", active: "Y", timeZone: "America/Sao_Paulo"};

		var request1 = {
			body: {
				user: user1
			}
		};

		var request2 = {
			body: {
				user: user2
			}
		};

		var statusCode = 0;

		var response2 = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				assert.equal(statusCode,400);
				done();
			}
		};		

		var response1 = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				auth.createAccount( request2, response2 );
			}
		};

		auth.createAccount( request1, response1 );
	});

})
