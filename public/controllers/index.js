angularApp.controller('indexController', ['$scope', 'restApi', 'loginService', function($scope, restApi, loginService) {

	$scope.isLogged = loginService.isLogged();

	$scope.logout = function() {
		loginService.logout();
	};

}]);