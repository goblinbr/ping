var dao = require('./genericdao').newDao('ping');

dao.findAllByHost = function(hostId, startDate, endDate, next) {
	var doc = dao.getDoc();

	doc.find({hostId: hostId, when: { $gte: startDate, $lte: endDate } }, next);
};

var superValidate = dao.validate;

dao.validate = function(document,isInsert){
	if( !document.hostId || document.hostId == '' ){
		return 'missing_ping_host';
	}
	if( document.ms == undefined ){
		return 'missing_ping_ms';
	}
	if( !document.when ){
		return 'missing_ping_when';
	}

	var validAttributes = ['hostId', 'ms', 'when', '_id'];

	for(attribute in document){
		var valid = false;
		for( i in validAttributes ){
			var validAttrib = validAttributes[i];
			if( validAttrib == attribute ){
				valid = true;
				break;
			}
		}
		if( !valid ){
			return "invalid_ping_" + attribute;
		}
	}
	return superValidate(document, isInsert);
};

module.exports = dao;