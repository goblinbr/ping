var dao = require('./genericdao').newDao('user');

dao.getDoc().index('email', { unique: true });

dao.findByEmail = function (email, next) {
	var doc = dao.getDoc();
	doc.findOne({email: email}, next);
};

var superValidate = dao.validate;
dao.validate = function(document,isInsert){
	if( !document.name || document.name == '' ){
		return 'missing_user_name';
	}
	if( !document.email || document.email == '' ){
		return 'missing_user_email';
	}
	else{
		// TOOD: validate email
	}
	if( !document.password || document.password == '' ){
		return 'missing_user_password';
	}
	else{
		// TODO: validate password
	}
	if( !document.timeZone || document.timeZone == '' ){
		return 'missing_user_timezone';
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
			return "invalid_user_" + attribute;
		}
	}
	return superValidate(document, isInsert);
};

module.exports = dao;