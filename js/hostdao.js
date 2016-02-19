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
		return "Informe o nome do host!";
	}
	if( !document.hostname || document.hostname == '' ){
		return "Informe o endereço/ip do host!";
	}
	else{
		var expressionIp = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
		var expressionHostname = /(^\s*((?=.{1,255}$)(?=.*[A-Za-z].*)[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|\b-){0,61}[0-9A-Za-z])?)*)\s*$)/;
		var isValidIP = expressionIp.test( document.hostname ) && document.hostname != "::1" && document.hostname != "127.0.0.1";
		if( !isValidIP ){
			var isValidHostname = expressionHostname.test( document.hostname ) && document.hostname.indexOf(".") > 0;
			if(!isValidHostname){
				return "Endereço/ip inválido!";
			}
		}
	}

	if( document.command ){
		if( document.command == 'C' ){
			if( !document.port || document.port == '' || document.port <= 0 ){
				return "Informe a porta do host!";
			}
		}
		else if( document.command != 'P' ){
			return "Tipo de comando inválido para o host!";
		}
	}

	if( !document.userId || document.userId == '' ){
		return "Informe o usuário para o host!";
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
			return "Atributo " + attribute + " inválido para hosts!";
		}
	}
	return superValidate(document, isInsert);
};

module.exports = dao;