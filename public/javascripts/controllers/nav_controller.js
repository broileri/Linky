app.controller('NavController', ['$scope', 'userinfo', function($scope, userinfo) {
    $scope.isLoggedIn = userinfo.isLoggedIn;
    $scope.currentUser = userinfo.currentUser;
    $scope.logOut = userinfo.logOut;

}]);