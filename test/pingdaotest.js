var _global = require('./global');
var assert = require('assert');
var moment = require('moment');
var pingdao = require('../js/dao/pingdao');


describe('js/dao/pingdao', function(){
	beforeEach(function(done){
		pingdao.deleteAll(function () {
			done();
		});
	})

	it('insert', function(done){
		var ping = {hostId: '1', ms: 30, when: new Date() };

		pingdao.insert(ping, function (err, data) {
			if( err ){
				assert.fail(err,undefined,'should not return an error');
			}
			else{
				assert.equal(data.when,ping.when);
			}
			done();
		});
	});

	it('insert with invalid attribute', function(done){
		var ping = {hostId: '1', ms: 30, when: new Date(), xxxx: 'a' };

		pingdao.insert(ping, function (err, data) {
			if( err ){
				assert.equal(err.message,'invalid_ping_xxxx');
			}
			else{
				assert.fail(err,undefined,'should return an error');
			}
			done();
		});
	});

	it('insert without hostId', function(done){
		var ping = {ms: 30, when: new Date()};

		pingdao.insert(ping, function (err, data) {
			if( err ){
				assert.equal(err.message,'missing_ping_host');
			}
			else{
				assert.fail(err,undefined,'should return an error');
			}
			done();
		});
	});

	it('insert', function(done){
		var ping = {hostId: '1', ms: 30, when: new Date() };

		pingdao.insert(ping, function (err, data) {
			if( err ){
				assert.fail(err,undefined,'should not return an error');
			}
			else{
				assert.equal(data.when,ping.when);
			}
			done();
		});
	});

	it('findAllByHost', function(done){
		var ping1 = {hostId: '1', ms: 30, when: moment("2016-03-31 00:00:00.000").toDate() };
		var ping2 = {hostId: '1', ms: 40, when: moment("2016-04-01 15:12:31.120").toDate() };
		var ping3 = {hostId: '2', ms: 25, when: moment("2016-04-01 15:12:31.120").toDate() };
		var ping4 = {hostId: '1', ms: 50, when: moment("2016-04-01 17:12:31.120").toDate() };

		pingdao.insert(ping1, function (err, data) {
			if( err ){
				assert.fail(err,undefined,'should not return an error 1');
				done();
			}
			else{
				pingdao.insert(ping2, function (err, data) {
					if( err ){
						assert.fail(err,undefined,'should not return an error 2');
						done();
					}
					else{
						pingdao.insert(ping3, function (err, data) {
							if( err ){
								assert.fail(err,undefined,'should not return an error 3');
								done();
							}
							else{
								pingdao.insert(ping4, function (err, data) {
									if( err ){
										assert.fail(err,undefined,'should not return an error 4');
										done();
									}
									else{
										pingdao.findAllByHost('1', moment("2016-03-31").toDate(), moment("2016-04-01 17:12:31.119").toDate(), function(err, data){
											if( err ){
												assert.fail(err,undefined,'should not return an error 5');
											}
											else{
												assert.equal( data.length, 2 );
											}
											done();
										} );
									}
								});
							}
						});
					}
				});
			}
		});
	});

});
