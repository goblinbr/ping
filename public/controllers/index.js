angularApp.controller('indexController', function($scope, restApi, loginService) {

	$scope.isLogged = loginService.isLogged();

	$scope.logout = function() {
		loginService.logout();
	};

});