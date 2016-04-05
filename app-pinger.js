var _global = require('./global');

var hostdao = require('./js/dao/hostdao');
var pinger = require('./js/pinger');

var hostsPerPage = 5;
var timeout = 500;

var app = {
	run: function() {
		hostdao.countPaidGreaterThanToday( function(error, count){
			console.log( new Date().toISOString().replace('T', ' ').substr(0, 19) + ": pinging " + count + " hosts");
			var pages = Math.ceil(count / hostsPerPage);
			var page = 0;

			var nextPage = function(){
				if( page < pages ){
					page++;
					hostdao.findAllPaidGreaterThanToday( page, hostsPerPage, function(error, hosts){
						var i = 0;

						var nextHost = function() {
							if( i < hosts.length ){
								var host = hosts[i];
								i++;

								pinger.pingOrConnect( host, timeout, nextHost );
							}
							else{
								nextPage();
							}
						};

						nextHost();
					} );
				}
				else{
					app.run();
				}
			};

			nextPage();


		});
	}
};

module.exports = app;