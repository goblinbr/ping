var dao = require('./genericdao').newDao('host');

var superInsert = dao.insert;

dao.insert = function(document, next) {
	var date = new Date();
	date.setDate(date.getDate() + GLOBAL.FREE_DAYS_FOR_NEW_HOSTS);

	document.paidUntil = date;
	superInsert(document,next);
},

dao.findAllByUser = function(userId, next) {
	var doc = dao.getDoc();
	doc.find({userId: userId}, next);
};

var superValidate = dao.validate;

dao.validate = function(document,isInsert){
	if( !document.name || document.name == '' ){
		return 'missing_host_name';
	}
	if( !document.hostname || document.hostname == '' ){
		return 'missing_host_hostname';
	}
	else{
		var expressionIp = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
		var expressionHostname = /(^\s*((?=.{1,255}$)(?=.*[A-Za-z].*)[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?)*)\s*$)/;
		var isValidIP = expressionIp.test( document.hostname ) && document.hostname != "::1" && document.hostname != "127.0.0.1";
		if( !isValidIP ){
			var isValidHostname = expressionHostname.test( document.hostname ) && document.hostname.indexOf(".") > 0;
			if(!isValidHostname){
				return 'invalid_host_hostname';
			}
		}
	}

	if( document.command ){
		if( document.command == 'C' ){
			if( !document.port || document.port == '' || document.port <= 0 ){
				return 'missing_host_port';
			}
		}
		else if( document.command != 'P' ){
			return 'invalid_host_command';
		}
	}

	if( !document.userId || document.userId == '' ){
		return 'missing_host_user';
	}

	var validAttributes = ['name', 'hostname', 'command', 'port', 'userId', 'paidUntil', '_id'];

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
			return "invalid_host_" + attribute;
		}
	}
	return superValidate(document, isInsert);
};

module.exports = dao;