var spawn = require('child_process').spawn;
var os = require('os');
var net = require('net');
var hoststatusdao = require('./dao/hoststatusdao');
var pingdao = require('./dao/pingdao');

var countParam = '-c';
if( os.type().toLowerCase().indexOf("win") == 0 ){
  countParam = '-n';
}

var timeout = 500;

var redundantHosts = [ {name: "Google", hostname: "www.google.com", port: 80, command: 'C'}, {name: "Amazon", hostname: "www.amazon.com", port: 80, command: 'C'} ]; 

var insertNewHostStatus = function( host, online, start ){
	var hoststatus = {hostId: host._id, start: start, online: online };
	hoststatusdao.insert( hoststatus, function(err){
		if(err){
			console.log( err.stack );
		}
	} );
};

var insertPing = function(host,ms) {
	var when = new Date();

	var ping = {hostId: host._id, ms: ms, when: when };
	pingdao.insert(ping, function(err){
		if(err){
			console.log( err.stack );
		}
	} );

	hoststatusdao.findOpenStatus( host.id_, function(err, hoststatus){
		if( err ){
			console.log( err.stack );
		}
		else{
			var online = ms > 0;
			if( hoststatus ){
				if( hoststatus.online != online ){
					hoststatus.finish = when;

					hoststatusdao.update( hoststatus, function(err, data){
						if( err ){
							console.log( err.stack );
						}
						else{
							insertNewHostStatus( host, online, new Date(when.getTime() + 1) );
						}
					} );
				}
			}
			else{
				insertNewHostStatus( host, online, when );
			}
		}
	} );
};

var onSucess = function(host,ms,next) {
	insertPing( host, ms );

	console.log( host.command + ': ' + host.name + ' = ' + ms );
	next();
};

var onFail = function(host,next) {
	var i = 0;
	var nextRedudantPing = function() {
		if( i < redundantHosts.length ){
			var redHost  = redundantHosts[i];
			i++;
			internalPingOrConnect( redHost, timeout, null, function(online, ms){
				if( online ){
					nextRedudantPing();
				}
				else{
					// TODO: insert that our system is offline
					console.log( 'OFFLINE' );
					next();
				}
			} );
		}
		else{
			internalPingOrConnect( host, 5000, null, function(online, ms){
				if( online ){
					onSucess( host, ms, next );
				}
				else{
					// TODO: insert ping -1
					console.log( host.command + ': ' + host.name + ' = OFFLINE' );
					next();
				}
			});
		}
	};

	nextRedudantPing();
};

var internalPingOrConnect = function(host, timeout, next, nextPriv) {
	var startMs = new Date().getTime();

	var returnFunction = function( online, client ){
		var endMs = new Date().getTime();
  		var ms = endMs - startMs;

  		if( client ){
  			client.destroy();
  		}

  		if( nextPriv ){
  			nextPriv( online, ms );
  		}
  		else{
	  		if( online ){
	  			onSucess(host, ms, next);
	  		}
	  		else{
	  			onFail(host, next);
	  		}
	  	}
	};

    if (host.command == 'P') {
       	var pingProcess = spawn( 'ping', [countParam, '1', host.hostname] );

		pingProcess.on('close', function(code) {
			var online = code == 0;

			returnFunction( online );
		});
    }
    else {
		var client = new net.Socket();

		client.setTimeout( timeout );

		client.on('error', function(data) {
			//console.log( 'error ' + data );
			returnFunction( false, client );
		});

		//client.on('close', function(data) {
			//console.log( 'close ' + data );
		//});

		client.on('timeout', function(data) {
			//console.log( 'timeout ' + data );
			returnFunction( false, client );
		});

		client.connect( host.port, host.hostname, function() {
			returnFunction( true, client );
		});
    }
};

var pinger = {
	pingOrConnect: function(host, timeout, next, nextPriv) {
		internalPingOrConnect( host, timeout, next, nextPriv );
	}
};

module.exports = pinger;
