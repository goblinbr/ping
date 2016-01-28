var _global = require('./global');
var assert = require('assert');

describe('String#split', function(){
	beforeEach(function(){
		current = 'a,b,c'.split(',');
	})

	it('should return an array', function(){
		assert(Array.isArray(current));
	});

	it('should return length = 3', function(){
		assert(current.length == 3);
	});
})