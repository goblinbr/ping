var angularApp = angular.module('app', []);

angularApp.factory('loginService', function($http, $window) {
	var loginService = {
		isLogged: function(){
			return $window.sessionStorage.token && $window.sessionStorage.user;
		},

		getToken: function(){
			return $window.sessionStorage.token;
		},

		getUser:  function(){
			return $window.sessionStorage.user;
		},

		login: function(username,password,successCallback,errorCallback){
			var onSuccess = function(response){
				$window.sessionStorage.user = response.data.user;
				$window.sessionStorage.token = response.data.token;

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
			delete $window.sessionStorage.user;

			$window.location.href = '/index.html';
		}
	};

	return loginService;
});

angularApp.factory('restApi', function($http, loginService) {
	var config = {};
	if (loginService.isLogged()) {
		config.headers = {};
		config.headers['X-Access-Token'] = loginService.getToken();
	}


	var api = {
		get: function(url, successCallback, errorCallback){
			var onSuccess = function(response) {
				if( successCallback ){
					successCallback(response.data);
				}
			};

			var onError = function(response){
				window.alert( "Erro: " + response.status + " - " + response.statusText );
				if(errorCallback){
					errorCallback(response);
				}
			};

			$http.get('/api' + url,config).then(onSuccess, onError);
		}
	};

	return api;
});
