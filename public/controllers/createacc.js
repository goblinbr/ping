angularApp.controller('createaccController', ['$scope', '$window', '$interval', 'loginService', function($scope, $window, $interval, loginService) {

	$scope.availableTimezones = {
	  'America/Araguaina': 'Araguaína',
	  'America/Bahia': 'Bahia',
	  'America/Belem': 'Belém',
	  'America/Boa_Vista': 'Boa Vista',
	  'America/Campo_Grande': 'Campo Grande',
	  'America/Cuiaba': 'Cuiabá',
	  'America/Eirunepe': 'Eirunepé',
	  'America/Noronha': 'Fernando de Noronha',
	  'America/Fortaleza': 'Fortaleza',
	  'America/Maceio': 'Maceió',
	  'America/Manaus': 'Manaus',
	  'America/Porto_Velho': 'Porto Velho',
	  'America/Recife': 'Recife',
	  'America/Rio_Branco': 'Rio Branco',
	  'America/Santarem': 'Santarém',
	  'America/Sao_Paulo': 'São Paulo/Brasília'
	};

	$scope.user = {
		timeZone: moment.tz.guess()
	};

	if( !($scope.user.timeZone in $scope.availableTimezones) ){
		$scope.user.timeZone = 'America/Sao_Paulo';
	}


	var updateLocalTime = function() {
		$scope.localTime = moment().tz( $scope.user.timeZone ).format( 'HH:mm:ss' );
	};

	updateLocalTime();

	$interval(updateLocalTime, 1000);

	$scope.alertMessage = '';
	$scope.showAlert = false;

	$scope.isLogged = loginService.isLogged();

	$scope.createAccount = function() {
		if( $scope.user.password != $scope.passwordConfirmation ){
			$scope.showAlert = true;
			$scope.alertMessage = "Senha não confere!";
		}
		else{
			var onSuccess = function(data){
				$scope.isLogged = loginService.isLogged();
				$window.location.href = '/index.html';
			};

			var onError = function(response){
				$scope.showAlert = true;
				$scope.alertMessage = response.data.message;
			};

			loginService.createAccount( $scope.user, onSuccess, onError );
		}
	};

}]);