angularApp.controller('hostsController', ['$scope', 'restApi', 'loginService', function($scope, restApi, loginService) {
	$scope.hosts = [];

	$scope.host = {};

	$scope.loginService = loginService;
	if( !$scope.loginService.verifyLoggedIn() ){
		return;
	}

	$scope.moment = moment;

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
			command: 'C'
		};
		$scope.showAlert = false;
		$scope.editTitle = "Incluir Host";
		$scope.submitButtonText = "Incluir";
		$scope.isEditingHost = true;
	}

	$scope.editHost = function(item){
		$scope.host = angular.copy(item);
		$scope.showAlert = false;
		$scope.editTitle = "Alterar Host";
		$scope.submitButtonText = "Alterar";
		$scope.isEditingHost = true;
	}

	$scope.createHost = function() {
		var onSucess = function(data){
			$scope.isEditingHost = false;
			$scope.refreshHosts();
		};

		var onError = function(data){
			$scope.showAlert = true;
			$scope.alertMessage = data.message;
		};

		if( $scope.host.command == 'P' ){
			$scope.host.port = 0;
		}
		if( $scope.host._id ){
			restApi.put( '/hosts', $scope.host, onSucess, onError );
		}
		else{
			restApi.post( '/hosts', $scope.host, onSucess, onError );
		}
	}

	$scope.cancel = function() {
		$scope.isEditingHost = false;
	}

	$scope.getHostClass = function(item){
		var datePaidUntil = new Date(item.paidUntil);
		var dateNow = new Date();
		var dateTomorrow = new Date( dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() + 1 );
		
		if( datePaidUntil < dateTomorrow ){
			return "danger";
		}
		return "success";
	}

	$scope.refreshHosts();
}]);