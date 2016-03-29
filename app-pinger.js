var _global = require('./global');

var hostdao = require('./js/hostdao');
var pinger = require('./js/pinger');

var timeout = 500;
var hostsPerPage = 5;

var redundantHosts = [ {name: "Google", hostname: "www.google.com", port: 80, command: 'C'}, {name: "Amazon", hostname: "www.amazon.com", port: 80, command: 'C'} ]; 

var onSucess = function(host,ms,next) {
	// TODO: insert ping
	console.log( host.command + ': ' + host.name + ' = ' + ms );
	next();
};

var onFail = function(host,next) {
	// TODO: ping redudantHosts, insert if is online or offline
	for( var i = 0; i < redundantHosts.length; i++ ){
	}

	//next();
	console.log( host.command + ': ' + host.name + ' = OFFLINE' );
	next();
};

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

								pinger.pingOrConnect( host, timeout, function(ret){
									if( ret.online ){
										onSucess( host, ret.ms, nextHost );
									}
									else{
										onFail( host, nextHost );
									}
								} )
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