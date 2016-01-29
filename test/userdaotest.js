var assert = require('assert');
var userdao = require('../js/userdao');


describe('userdao', function(){
	beforeEach(function(done){
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
		var user = {name: "Rodrigo de Bona Sartor", email: "xxx@gmail.com", password: "", active: "Y", timezone: "-3", token: "ABC-0123-ASDASD"};

		userdao.insert(user, function (data) {
			assert.equal(data.name,user.name);
			done();
		});
	});

	it('findById that exists', function(done){
		var user = {name: "Rodrigo de Bona Sartor", email: "xxx@gmail.com", password: "", active: "Y", timezone: "-3", token: "ABC-0123-ASDASD"};

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
		var user = {name: "Rodrigo de Bona Sartor", email: "xxx@gmail.com", password: "", active: "Y", timezone: "-3", token: "ABC-0123-ASDASD"};
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
		var user = {name: "Rodrigo de Bona Sartor", email: "xxx@gmail.com", password: "", active: "Y", timezone: "-3", token: "ABC-0123-ASDASD"};
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
			var user = {name: "User " + i, email: "xxx@gmail.com", password: "", active: "Y", timezone: "-3", token: "ABC-0123-ASDASD"};
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
			var user = {name: "User " + i, email: "xxx@gmail.com", password: "", active: "Y", timezone: "-3", token: "ABC-0123-ASDASD"};
			userdao.insert(user,returnFunction);
		}
	});
})
