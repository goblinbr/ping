var assert = require('assert');
var userdao = require('../js/userdao');


describe('userdao', function(){
	beforeEach(function(done){
		userdao.removeAll(function () {
			done();
		});
	})

	it('findAll with empty collection', function(done){
		userdao.findAll(function (data) {
			assert.equal(data.length,0);
			done();
		});
	});

	it('insert', function(done){
		var user = {name: "Rodrigo de Bona Sartor", email: "rodrigo.goblin@gmail.com", password: "", active: "Y", timezone: "-3", token: "ABC-0123-ASDASD"};

		userdao.insert(user, function (data) {
			assert.equal(data.name,user.name);
			assert.equal(data.email,user.email);
			assert.equal(data.password,user.password);
			assert.equal(data.active,user.active);
			assert.equal(data.timezone,user.timezone);
			assert.equal(data.token,user.token);
			done();
		});
	});

	it('findById that exists', function(done){
		var user = {name: "Rodrigo de Bona Sartor", email: "rodrigo.goblin@gmail.com", password: "", active: "Y", timezone: "-3", token: "ABC-0123-ASDASD"};

		userdao.insert(user, function (data) {
			userdao.findById( data._id, function (data){
				assert.equal(data.name,user.name);
				assert.equal(data.email,user.email);
				assert.equal(data.password,user.password);
				assert.equal(data.active,user.active);
				assert.equal(data.timezone,user.timezone);
				assert.equal(data.token,user.token);
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

})
