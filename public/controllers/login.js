angularApp.controller('loginController', ['$scope', '$window', 'loginService', function($scope, $window, loginService) {

	$scope.user = {};
	$scope.alertMessage = '';
	$scope.showAlert = false;

	$scope.isLogged = loginService.isLogged();

	$scope.login = function() {
		var onSuccess = function(data){
			$scope.isLogged = loginService.isLogged();
			$window.location.href = '/index.html';
		};

		var onError = function(response){
			$scope.showAlert = true;
			$scope.alertMessage = response.data.message;
		};

		loginService.login( $scope.user.username, $scope.user.password, onSuccess, onError );
	};

}]);