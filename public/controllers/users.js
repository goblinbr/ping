angularApp.controller('usersController', function($scope, restApi) {
	$scope.users = 'ABC';

	restApi.get( '/admin/users/1/10', function(data){
		$scope.users = data;
	} );
});