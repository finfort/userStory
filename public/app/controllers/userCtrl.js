angular.module('userCtrl',['userService'])
	

	.controller('userController', function(User){


		var vm = this;


		User.all()
			.success(function(data){
				vm.users= data;
			})


	})

	.controller('userCreateController', function(User, $location, $window){

		var vm = this;

			vm.signupUser = function(){

				console.log("Trying to create user!");

				vm.message = '';

				User.create(vm.userData)
					.then(function(response){
						vm.userData = {};
						vm.message = response.data.message;

						$window.localStorage.setItem('token', response.data.token);
						$location.path('/');
					})
			}
	});

	
	
