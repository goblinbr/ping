// Returns true if execution should continue, else return false
var handler = function(err, req, res, next) {
	if( err ){
		if( err.status == 404 && req.path.endsWith(".map") ){
			console.log( 'Path:' + req.path + '  Error: ' + err.status );
			res.status(err.status);
			res.end();
		}
		else{
			if( err.name == 'MongoError' ){
				if(!err.message){
					err.message = err.err;
				}
				err.status = 400;
				if( err.code == 11000 || err.code == 11001 ){ // unique index violation
					var docName = getDocNameFromIndexError(err.err);
					var indexName = getIndexNameFromIndexError(err.err);
					err.message = "duplicate_" + docName + "_" + indexName;
				}
			}

			err.status = err.status || 500;
			if( GLOBAL.ENV != 'TEST' ){
				console.log( 'Path:' + req.path + '  Error: ' + err.status + ' - ' + err.stack );
			}
			res.status(err.status);
			if( err.status == 404 ){
				if( req.path.endsWith(".html") ){
					res.redirect('/error/' + err.status + '.html');
				}
				else{
					res.end();
				}
			}
			else if( err.message ){
				res.json({
					status: err.status,
					message: err.message
				});
			}
			else{
				res.redirect('/error/' + err.status + '.html');
			}
		}
		return false;
	}
	else{
		return true;
	}
};

// mongoMsg = E11000 duplicate key error collection: pingtest.user index: email_1 dup key: { : \"xxx@gmail.com\" }"
function getDocNameFromIndexError(mongoMsg){
	var indexIni = mongoMsg.indexOf('.') + 1;
	var indexFim = mongoMsg.indexOf(' ', indexIni );
	return mongoMsg.substring( indexIni, indexFim );
}

function getIndexNameFromIndexError(mongoMsg){
	var indexIni = mongoMsg.indexOf('index:') + 7;
	var indexFim = mongoMsg.indexOf('_', indexIni );
	return mongoMsg.substring( indexIni, indexFim );	
}

module.exports = handler;