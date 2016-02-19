var _global = require('./global');
var assert = require('assert');

var hosts = require('../routes/hosts');
var userdao = require('../js/userdao');
var hostdao = require('../js/hostdao');

describe('routes/hosts', function(){
	var user = {name: "Rodrigo de Bona Sartor", email: "xxx@gmail.com", password: "abcd1234", active: "Y", timeZone: "America/Sao_Paulo", token: "ABC-0123-ASDASD"};

	beforeEach(function(done){
		userdao.deleteAll(function () {
			userdao.insert( user, function(err, data){
				user = data;
				hostdao.deleteAll(function () {
					done();
				});
			} );
		});
	})

	it('findAllByUser without hosts', function(done){
		var request = {
			user: user
		};

		var statusCode = 0;

		var response = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				assert.equal(data.length,0);
				done();
			}
		};

		hosts.findAllByUser( request, response );
	});

	it('paidUntil on insert', function(done){
		var host = {name: "Google", hostname: "www.google.com", port: 80, command: 'C', userId: user._id.toString()};

		var request = {
			user: user,
			body: host
		};

		var statusCode = 0;

		var date = new Date();

		var response = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				assert.equal(data.paidUntil.getDate(),date.getDate());
				assert.equal(data.paidUntil.getMonth(),date.getMonth());
				assert.equal(data.paidUntil.getFullYear(),date.getFullYear());
				done();
			}
		};

		date.setDate( date.getDate() + GLOBAL.FREE_DAYS_FOR_NEW_HOSTS );
		hosts.insert( request, response );
	});

	it('findAllByUser with 2 hosts', function(done){
		var hostFromUserOne = {name: "Google", hostname: "www.google.com", port: 80, command: 'C', userId: user._id.toString()};
		var hostFromUserTwo = {name: "Amazon", hostname: "www.amazon.com", port: 80, command: 'C', userId: user._id.toString()};
		var hostFromAnotherUser = {name: "Amazon", hostname: "www.amazon.com", port: 80, command: 'C', userId: '0'};

		var request = {
			user: user
		};

		var statusCode = 0;

		var response = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				assert.equal(data.length,2);
				done();
			}
		};


		hostdao.insert( hostFromUserOne, function(){
			hostdao.insert( hostFromAnotherUser, function(){
				hostdao.insert( hostFromUserTwo, function(){
					hosts.findAllByUser( request, response );
				});
			});
		} );
	});

	it('insert with invalid user', function(done){
		var hostFromAnotherUser = {name: "Amazon", hostname: "www.amazon.com", port: 80, command: 'C', userId: 'XXXXX'};

		var request = {
			user: user,
			body: hostFromAnotherUser
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

		hosts.insert( request, response );
	});

	it('insert with valid user', function(done){
		var host = {name: "Amazon", hostname: "www.amazon.com", port: 80, command: 'C', userId: user._id.toString()};

		var request = {
			user: user,
			body: host
		};

		var statusCode = 0;

		var response = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				assert.equal(data.name,host.name);
				done();
			}
		};

		hosts.insert( request, response );
	});

	it('insert without user', function(done){
		var host = {name: "Amazon", hostname: "www.amazon.com", port: 80, command: 'C'};

		var request = {
			user: user,
			body: host
		};

		var statusCode = 0;

		var response = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				assert.equal(data.userId,user._id.toString());
				done();
			}
		};

		hosts.insert( request, response );
	});

	it('update with invalid user', function(done){
		var host = {name: "Amazon", hostname: "www.amazon.com", port: 80, command: 'C', userId: user._id.toString()};

		hostdao.insert( host, function(err,data){
			data.userId = '123';

			var request = {
				user: user,
				body: data
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

			hosts.update( request, response );
		} );
	});

	it('update with valid user', function(done){
		var host = {name: "Amazon", hostname: "www.amazon.com", port: 80, command: 'C', userId: user._id.toString()};

		hostdao.insert( host, function(err, data){
			data.userId = user._id.toString();

			var request = {
				user: user,
				body: data
			};

			var statusCode = 0;

			var response = {
				status: function(st){
					statusCode = st;
				},

				json: function(data){
					assert.equal( data, 1 );
					done();
				}
			};

			hosts.update( request, response );
		} );
	});

	it('insert with valid hostname', function(done){
		var host = {name: "Amazon", hostname: "www.amazon.com", port: 80, command: 'C', userId: user._id.toString()};

		var request = {
			user: user,
			body: host
		};

		var statusCode = 0;

		var response = {
			status: function(st){
				statusCode = st;
			},

			json: function(data){
				assert.equal(data.name,host.name);
				done();
			}
		};

		hosts.insert( request, response );
	});

})
