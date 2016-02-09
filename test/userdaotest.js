var _global = require('./global');
var assert = require('assert');
var userdao = require('../js/userdao');


describe('js/userdao', function(){
	var defaultUser = {};

	beforeEach(function(done){
		defaultUser = {name: "Rodrigo de Bona Sartor", email: "xxx@gmail.com", password: "asdasd", active: "Y", timeZone: "America/Sao_Paulo", token: "ABC-0123-ASDASD"};

		userdao.removeAll(function () {
			done();
		});
	})

	it('findAll with empty collection', function(done){
		userdao.findAll(0, 0, function (data) {
			assert.equal(data.length,0);
			done();
		});
	});

	it('insert', function(done){
		var user = defaultUser;

		userdao.insert(user, function (data) {
			assert.equal(data.name,user.name);
			done();
		});
	});

	it('findById that exists', function(done){
		var user = defaultUser;

		userdao.insert(user, function (data) {
			userdao.findById( data._id, function (data){
				assert.equal(data.name,user.name);
				done();
			} );
		});
	});

	it('findById that doesnt exist', function(done){
		userdao.findById( 1, function (data){
			assert.equal(data,undefined);
			done();
		} );
	});

	it('remove', function(done){
		var user = defaultUser;
		userdao.insert(user, function (data) {
			var id = data._id;
			userdao.remove( id, function (data) {
				userdao.findById( id, function (data){
					assert.equal(data,undefined);
					done();
				});
			});
		});
	});

	it('update', function(done){
		var user = defaultUser;
		userdao.insert(user, function (data) {
			user = data;
			var id = data._id;

			user.name = "Not Rodrigo";

			userdao.update( user, function (data) {
				userdao.findById( id, function (data){
					assert.equal(data.name,"Not Rodrigo");
					done();
				});
			});
		});
	});

	it('findAll At page 2 with 5 documents each page with a total of 7 documents', function(done){
		var insertCount = 0;
		var totalDocs = 7;
		var returnFunction = function(data){
			insertCount++;
			if( insertCount == totalDocs ){
				userdao.findAll(2, 5, function (data) {
					assert.equal(data.length,2);
					done();
				});
			}
		};

		for( var i = 1; i <= totalDocs; i++ ){
			var user = defaultUser;
			user.name = "User " + i;
			delete user._id;
			userdao.insert(user,returnFunction);
		}
	});

	it('count 7 documents', function(done){
		var insertCount = 0;
		var totalDocs = 7;
		var returnFunction = function(data){
			insertCount++;
			if( insertCount == totalDocs ){
				userdao.count(function(data){
					assert.equal(data,totalDocs);
					done();
				});
			}
		};

		for( var i = 1; i <= totalDocs; i++ ){
			var user = defaultUser;
			user.name = "User " + i;
			delete user._id;
			userdao.insert(user,returnFunction);
		}
	});

	it('findByEmail that exists', function(done){
		var user = defaultUser;

		userdao.insert(user, function (data) {
			userdao.findByEmail( user.email, function (data){
				assert.equal(data.name,user.name);
				done();
			} );
		});
	});
})
