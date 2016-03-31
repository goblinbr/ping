var _global = require('./global');
var assert = require('assert');
var hoststatusdao = require('../js/dao/hoststatusdao');


describe('js/dao/hoststatusdao', function(){
	beforeEach(function(done){
		hoststatusdao.deleteAll(function () {
			done();
		});
	})

	it('insert', function(done){
		var hoststatus = {hostId: '1', start: new Date(), finish: new Date(), online: true };

		hoststatusdao.insert(hoststatus, function (err, data) {
			if( err ){
				assert.fail(err,undefined,'should not return an error');
			}
			else{
				assert.equal(data.start,hoststatus.start);
			}
			done();
		});
	});

	it('insert with invalid attribute', function(done){
		var hoststatus = {hostId: '1', start: new Date(), finish: new Date(), online: true, xxxx: 'a' };

		hoststatusdao.insert(hoststatus, function (err, data) {
			if( err ){
				assert.equal(err.message,'invalid_hoststatus_xxxx');
			}
			else{
				assert.fail(err,undefined,'should return an error');
			}
			done();
		});
	});

	it('insert without hostId', function(done){
		var hoststatus = {start: new Date(), finish: new Date(), online: true};

		hoststatusdao.insert(hoststatus, function (err, data) {
			if( err ){
				assert.equal(err.message,'missing_hoststatus_host');
			}
			else{
				assert.fail(err,undefined,'should return an error');
			}
			done();
		});
	});

	it('insert without valid value for start', function(done){
		var hoststatus = {hostId: '1', start: 'asdasd', online: true};

		hoststatusdao.insert(hoststatus, function (err, data) {
			if( err ){
				assert.equal(err.message,'invalid_value_hoststatus_start');
			}
			else{
				assert.fail(err,undefined,'should return an error');
			}
			done();
		});
	});

	it('insert without valid value for finish', function(done){
		var hoststatus = {hostId: '1', start: new Date(), finish: 'asd', online: true};

		hoststatusdao.insert(hoststatus, function (err, data) {
			if( err ){
				assert.equal(err.message,'invalid_value_hoststatus_finish');
			}
			else{
				assert.fail(err,undefined,'should return an error');
			}
			done();
		});
	});

	it('insert without valid value for online', function(done){
		var hoststatus = {hostId: '1', start: new Date(), finish: new Date(), online: 'false'};

		hoststatusdao.insert(hoststatus, function (err, data) {
			if( err ){
				assert.equal(err.message,'invalid_value_hoststatus_online');
			}
			else{
				assert.fail(err,undefined,'should return an error');
			}
			done();
		});
	});

});
