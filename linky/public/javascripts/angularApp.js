var app = angular.module('LinkApp', ['ui.router']);


app.config(['$stateProvider',	'$urlRouterProvider',	function($stateProvider, $urlRouterProvider) {

	  $stateProvider
	    .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainController',
        // Query posts from the backend before the state finishes loading
        resolve: {
          postPromise: ['posts', function(posts){
            return posts.getAll();
          }]
        }
      });

	  $stateProvider
	    .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsController',
        // Query posts with comments from the backend before the state finishes loading
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams, posts) {
            return posts.get($stateParams.id);
          }]
        }
      });

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: '/login.html',
        controller: 'AuthController',
        onEnter: ['$state', 'auth', function($state, auth){
          if(auth.isLoggedIn()){
            $state.go('home');
          }
        }]
      })

    $stateProvider
      .state('register', {
        url: '/register',
        templateUrl: '/register.html',
        controller: 'AuthController',
        onEnter: ['$state', 'auth', function($state, auth){
          if(auth.isLoggedIn()){
            $state.go('home');
          }
        }]
      });

	  $urlRouterProvider.otherwise('home');
}]);