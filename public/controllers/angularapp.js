var angularApp = angular.module('app', []);

angularApp.factory('restApi', function($http) {
	var api = {};

	api.get = function(url, successCallback, errorCallback){
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

		$http.get('/api' + url).then(onSuccess, onError);
	};

	return api;
});