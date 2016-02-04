angularApp.controller('usersController', ['$scope', 'restApi', function($scope, restApi) {
	$scope.users = 'ABC';

	restApi.get( '/admin/users/1/10', function(data){
		$scope.users = data;
	} );
}]);