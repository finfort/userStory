
angular.module('mainCtrl', ['authService'])

.controller('MainController', function($rootScope, $location, Auth){

	var vm = this;
	vm.loggedIn = Auth.isLoggedIn();
	$rootScope.$on('$routeChangeStart', function(){
		vm.loggedIn = Auth.isLoggedIn();

		Auth.getUser()
			.then(function(data){
				vm.user = data.data;
			});
	});
// Use AUth service to login
	vm.doLogin = function(){
		console.log("Trying to login");

		vm.processing = true;
		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data){
				vm.processing = false;

				Auth.getUser()
					.then(function(data){
						vm.user = data.data;
					});

				if(data.success)
					$location.path('/');
				else
					vm.error = data.message;
			});
	};

	// Use AUth service to logout
	vm.doLogout = function(){
		Auth.logout();
		$location.path('/logout');
	};
})