var _global = require('./global');
var assert = require('assert');

var pinger = require('../js/pinger');

describe('js/pinger (requires internet connection)', function(){

	it('pingOrConnect with valid ping host', function(done){
		var host = { name: "Google", hostname: "www.google.com", port: 0, command: 'P' };

		pinger.pingOrConnect( host, 5000, function(ret) {
			assert.equal(ret.online, true);
			done();
		} );
	});

	it('pingOrConnect with invalid ping host', function(done){
		var host = { name: "Google", hostname: "www.google.com.x.x.x", port: 0, command: 'P' };

		pinger.pingOrConnect( host, 500, function(ret) {
			assert.equal(ret.online, false);
			done();
		} );
	});

	it('pingOrConnect with valid connect host', function(done){
		var host = { name: "Google", hostname: "www.google.com", port: 80, command: 'C' };

		pinger.pingOrConnect( host, 5000, function(ret) {
			assert.equal(ret.online, true);
			done();
		} );
	});

	it('pingOrConnect with invalid connect host', function(done){
		var host = { name: "Google", hostname: "www.google.com.x.x.x", port: 80, command: 'C' };

		pinger.pingOrConnect( host, 500, function(ret) {
			assert.equal(ret.online, false);
			done();
		} );
	});

	it('pingOrConnect with valid connect host IPV6', function(done){
		var host = { name: "Google", hostname: "2800:3f0:4001:802::200e", port: 80, command: 'C' };

		pinger.pingOrConnect( host, 1000, function(ret) {
			assert.equal(ret.online, true);
			done();
		} );
	});

})
