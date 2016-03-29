var spawn = require('child_process').spawn;
var os = require('os');
var net = require('net');

var countParam = '-c';
if( os.type().toLowerCase().indexOf("win") == 0 ){
  countParam = '-n';
}

var pinger = {
	pingOrConnect: function(host, timeout, callback) {
		var startMs = new Date().getTime();

		var ret = {
			online: false,
			ms: 0
		};

        if (host.command == 'P') {
	       	var pingProcess = spawn( 'ping', [countParam, '1', host.hostname] );

			pingProcess.on('close', function(code) {
		  		var endMs = new Date().getTime();
		  		ret.ms = endMs - startMs;
		  		ret.online = code == 0;

		  		callback( ret );
			});
        }
        else {
			var client = new net.Socket();

			var returnFunction = function( online ){
		  		var endMs = new Date().getTime();
		  		ret.ms = endMs - startMs;
		  		ret.online = online;

		  		client.destroy();

		  		callback( ret );
			};

			client.setTimeout( timeout );

			client.on('error', function(data) {
				//console.log( 'error ' + data );
				returnFunction( false );
			});

			//client.on('close', function(data) {
				//console.log( 'close ' + data );
			//});

			client.on('timeout', function(data) {
				//console.log( 'timeout ' + data );
				returnFunction( false );
			});

			client.connect( host.port, host.hostname, function() {
				returnFunction( true );
			});
        }
	}
};

module.exports = pinger;
