app.controller('UserController', ['$scope', '$state', 'userinfo', function($scope, $state, userinfo) {
    $scope.user = {};

    $scope.register = function(){
      userinfo.register($scope.user).error(function(error){
        handleError(error);
      }).then(function(){
        $state.go('home');
      });
    };

    $scope.logIn = function(){
      userinfo.logIn($scope.user).error(function(error){
        //$scope.error = error; console.log(error);
        handleError(error);
      }).then(function(){
        $state.go('home');
      });
    };

    var handleError = function(error) {     
      if (error.code) { // used by node/express        
        if (error.code == "11000") {
          $scope.error = {username: "This username is already taken."}
        }
        else {
          $scope.error = {username: "An unknown error occurred. :(", password: "An unknown error occurred. :("};
        }
      }
      else if (error.message) { // used by passport.js
        if (error.message == "Incorrect username.") { $scope.error = {username: error.message}; }
        if (error.message == "Incorrect password.") { $scope.error = {password: error.message}; }
        
      }
      else if (error.username || error.password) { // custom errors
        $scope.error = error; 
      }
    };
}])
