var dao = require('./genericdao').newDao('user');

dao.findByEmail = function (email, returnFunction) {
	var doc = dao.getDoc();
	doc.find({email: email}, function(err, data, a, b){
		if (err) throw err;
		returnFunction(data[0]);
	});
};

var superValidate = dao.validate;

dao.validate = function(document,isInsert){
	if( !document.name || document.name == '' ){
		return "Informe o nome do usuário!";
	}
	if( !document.email || document.email == '' ){
		return "Informe o email do usuário!";
	}
	else{
		// TOOD: validate email
	}
	if( !document.password || document.password == '' ){
		return "Informe a senha do usuário!";
	}
	else{
		// TODO: validate password
	}
	if( !document.timeZone || document.timeZone == '' ){
		return "Informe o fuso horário do usuário!";
	}
	else{
		// TODO: validate timeZone
	}

	var validAttributes = ['name', 'email', 'password', 'timeZone', 'active', 'token', '_id'];

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
			return "Atributo " + attribute + " inválido para usuários!";
		}
	}
	return superValidate(document, isInsert);
};

module.exports = dao;