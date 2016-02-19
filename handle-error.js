// Returns true if execution should continue, else return false
var handler = function(err, req, res, next) {
	if( err ){
		if( err.status == 404 && req.path.endsWith(".map") ){
			console.log( 'Path:' + req.path + '  Error: ' + err.status );
		}
		else{
			var errorStatus = (err.status) ? err.status : 500;
			if( GLOBAL.ENV != 'TEST' ){
				console.log( 'Path:' + req.path + '  Error: ' + errorStatus + ' - ' + err.stack );
			}
			res.status(errorStatus);
			if( err.message ){
				res.json({
					status: errorStatus,
					message: err.message
				});
			}
			else{
				res.render('error/' + errorStatus + '.html');
			}
		}
		return false;
	}
	else{
		return true;
	}
};

module.exports = handler;