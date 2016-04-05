var dao = require('./genericdao').newDao('hoststatus');

dao.findOpenStatus = function (hostId, next) {
	var doc = dao.getDoc();
	doc.findOne({hostId: hostId, finish: null}, next);
};

var superValidate = dao.validate;

dao.validate = function(document,isInsert){
	if( !document.hostId || document.hostId == '' ){
		return 'missing_hoststatus_host';
	}

	if( !document.start ){
		return 'missing_hoststatus_start';
	}
	else if( !(document.start instanceof Date) ){
		return 'invalid_value_hoststatus_start';
	}

	if( document.finish && !(document.finish instanceof Date) ){
		return 'invalid_value_hoststatus_finish';
	}

	if( document.online == undefined ){
		return 'missing_hoststatus_online';
	}
	else if( document.online != true && document.online != false ){
		return 'invalid_value_hoststatus_online';
	}

	var validAttributes = ['hostId', 'start', 'finish', 'online', '_id'];

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
			return "invalid_hoststatus_" + attribute;
		}
	}
	return superValidate(document, isInsert);
};

module.exports = dao;