angular.module('authService', [])



.factory('Auth', function($http, $q, AuthToken){

	var authFactory = {};

	authFactory.login =  function(username, password){
	console.log("authFactory.login");

		return $http.post('/api/login',{
			username : username,
			password : password
		})
		.success(function(data){
			AuthToken.setToken(data.token);
			return data;
		});
	}

	authFactory.logout = function(){
		AuthToken.setToken();
	}


	authFactory.isLoggedIn = function(){
	console.log("isloggedIn");

		if(AuthToken.getToken()){
			return true;
		}else{
			return false;
		}

	}

	authFactory.getUser = function(){
		if(AuthToken.getToken()){
			return $http.get('/api/me');
		}else{
			return $q.reject({ message: "User has no token"});
		}
	}

	return authFactory;
})

.factory('AuthToken', function($window){

	var authTokenFactory = {};
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	}

	authTokenFactory.setToken = function(token){
	console.log("setToken");

		if(token){
			$window.localStorage.setItem('token', token);

		}else{
			$window.localStorage.removeItem('token');
		}
	}
	return authTokenFactory;
})

.factory('AuthInterceptor', function($q, $location, AuthToken){

	var interceptFactory = {};

	interceptFactory.request = function(config){
		var token = AuthToken.getToken();

		if(token){
			config.headers['x-access-token'] = token;
		}

		return config;
	};

	interceptFactory.responseError = function(response){
		if(response.status == 404)
			$location.path('/login');

		return $q.reject(response);
	};

	return interceptFactory;
})

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});