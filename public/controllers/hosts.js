angularApp.controller('hostsController', ['$scope', 'restApi', 'loginService', function($scope, restApi, loginService) {
	$scope.hosts = [];

	$scope.host = {};

	$scope.loginService = loginService;

	$scope.availableCommands = {
		C: 'Conectar',
		P: 'Ping'
	};

	$scope.refreshHosts = function() {
		restApi.get( '/hosts', function(data){
			$scope.hosts = data;
		} );
	}

	$scope.addHost = function() {
		$scope.host = {
			port: 80,
			command: 'C',
			userId: loginService.getUserId()
		};
		$scope.showAlert = false;
		$scope.isAddingHost = true;
	}

	$scope.createHost = function() {
		var onSucess = function(data){
			$scope.isAddingHost = false;
			$scope.refreshHosts();
		};

		var onError = function(data){
			$scope.showAlert = true;
			$scope.alertMessage = data.message;
		};

		restApi.post( '/hosts', $scope.host, onSucess, onError );
	}

	$scope.cancel = function() {
		$scope.isAddingHost = false;
	}

	$scope.refreshHosts();
}]);