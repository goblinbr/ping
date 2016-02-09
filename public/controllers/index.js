angularApp.controller('indexController', ['$scope', 'restApi', 'loginService', function($scope, restApi, loginService) {

	$scope.loginService = loginService;

}]);