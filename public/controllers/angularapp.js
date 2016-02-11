var angularApp = angular.module('app', ['ngCookies']);

angularApp.factory('loginService', ['$http', '$window', '$cookies', function($http, $window, $cookies) {
	var storageSession = function(data, stayLoggedIn){
		$window.sessionStorage.userId = data.user._id;
		$window.sessionStorage.userName = data.user.name;
		$window.sessionStorage.userEmail = data.user.email;
		$window.sessionStorage.token = data.token;

		if(stayLoggedIn){
			var expireDate = new Date();
			expireDate.setDate( expireDate.getDate() + 365 );

			var cookieConfig = {
				expires: expireDate
			};

			$cookies.put('token', $window.sessionStorage.token, cookieConfig);
			$cookies.put('userId', $window.sessionStorage.userId, cookieConfig);
			$cookies.put('userName', $window.sessionStorage.userName, cookieConfig);
			$cookies.put('userEmail', $window.sessionStorage.userEmail, cookieConfig);
		}
		else{
			$cookies.remove('token');
			$cookies.remove('userId');
			$cookies.remove('userName');
			$cookies.remove('userEmail');
		}
	};

	var cookieToken = $cookies.get('token');
	var cookieUserId = $cookies.get('userId');
	var cookieUserName = $cookies.get('userName');
	var cookieUserEmail = $cookies.get('userEmail');
	if( cookieToken && cookieUserId && cookieUserName && cookieUserEmail ){
		$window.sessionStorage.userId = cookieUserId;
		$window.sessionStorage.userName = cookieUserName;
		$window.sessionStorage.userEmail = cookieUserEmail;
		$window.sessionStorage.token = cookieToken;
	}

	var loginService = {
		isLogged: function(){
			return $window.sessionStorage.token && $window.sessionStorage.userId;
		},

		getToken: function(){
			return $window.sessionStorage.token;
		},

		getUserId:  function(){
			return $window.sessionStorage.userId;
		},

		getUserName:  function(){
			return $window.sessionStorage.userName;
		},

		getUserEmail:  function(){
			return $window.sessionStorage.userEmail;
		},

		login: function(username, password, stayLoggedIn, successCallback, errorCallback){
			var onSuccess = function(response){
				storageSession(response.data, stayLoggedIn);
				if(successCallback){
					successCallback(response.data);
				}
			};

			var onError = function(response){
				if(errorCallback){
					errorCallback(response);
				}
			};

			var user = {
				username: username,
				password: password
			};

			$http.post('/login', user).then(onSuccess, onError);
		},

		logout: function(){
			delete $window.sessionStorage.token;
			delete $window.sessionStorage.userId;
			delete $window.sessionStorage.userName;
			delete $window.sessionStorage.userEmail;

			$cookies.remove('token');
			$cookies.remove('userId');
			$cookies.remove('userName');
			$cookies.remove('userEmail');

			$window.location.href = '/index.html';
		},

		verifyLoggedIn: function(){
			if(!loginService.isLogged()){
				$window.location.href = '/index.html';
				return false;
			}
			return true;
		},

		createAccount: function(user,successCallback,errorCallback){
			var onSuccess = function(response){
				storageSession(response.data, false);

				if(successCallback){					
					successCallback(response.data);
				}
			};

			var onError = function(response){
				if(errorCallback){
					errorCallback(response);
				}
			};

			var message = {
				user: user
			};

			$http.post('/createacc', message).then(onSuccess, onError);
		}
	};

	return loginService;
}]);

angularApp.factory('restApi', ['$http', 'loginService', function($http, loginService) {
	var config = {};
	if (loginService.isLogged()) {
		config.headers = {};
		config.headers['X-Access-Token'] = loginService.getToken();
	}

	var apiOnSuccess = function(successCallback){
		return function(response){
			if( successCallback ){
				successCallback(response.data);
			}
		};
	}

	var apiOnError = function(errorCallback){
		return function(response) {
			if(errorCallback){
				var data = response.data;
				if( !data ){
					data = {};
				}
				if( !data.message ){
					data.message = response.statusText;
				}
				if( !data.status ){
					data.status = response.status;
				}
				errorCallback(data);
			}
			else{
				if( response.data.message ){
					window.alert( "Erro: " + response.data.message );
				}
				else{
					window.alert( "Erro: " + response.status + " - " + response.statusText );
				}
			}
		};
	}


	var api = {
		get: function(url, successCallback, errorCallback){
			$http.get('/api' + url,config).then(apiOnSuccess(successCallback), apiOnError(errorCallback));
		},

		post: function(url, body, successCallback, errorCallback){
			$http.post('/api' + url, body, config).then(apiOnSuccess(successCallback), apiOnError(errorCallback));
		},

		put: function(url, body, successCallback, errorCallback){
			$http.put('/api' + url, body, config).then(apiOnSuccess(successCallback), apiOnError(errorCallback));
		}
	};

	return api;
}]);
