angularApp.controller('loginController', function($scope, $window, loginService) {

	$scope.user = {};

	$scope.isLogged = loginService.isLogged();

	$scope.login = function() {
		var onSuccess = function(data){
			$scope.isLogged = loginService.isLogged();
			$window.location.href = '/index.html';
		};

		var onError = function(response){
			window.alert( "Erro: " + response.status + " - " + response.statusText );
		};

		loginService.login( $scope.user.username, $scope.user.password, onSuccess, onError );
	};

});