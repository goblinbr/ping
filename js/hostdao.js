var dao = require('./genericdao').newDao('host');

var superInsert = dao.insert;

dao.insert = function(document, returnFunction) {
	var date = new Date();
	date.setDate(date.getDate() + GLOBAL.FREE_DAYS_FOR_NEW_HOSTS);

	document.paidUntil = date; // TODO: get only date, the time doesnt matter
	superInsert(document,returnFunction);
},

dao.findAllByUser = function(userId, returnFunction) {
	var doc = dao.getDoc();
	doc.find({userId: userId}, function(err, data, a, b){
		if (err) throw err;
		returnFunction(data);
	});
};

var superValidate = dao.validate;

dao.validate = function(document,isInsert){
	if( !document.name || document.name == '' ){
		return "Informe o nome do host!";
	}
	if( !document.hostname || document.hostname == '' ){
		return "Informe o hostname do host!";
	}
	else{
		// TOOD: validate hostname
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