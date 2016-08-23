app.controller('MainController', ['$scope', 'posts', 'auth', function($scope, posts, auth) {
  
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.posts = posts.posts;

  $scope.addPost = function(){

    if(!$scope.title || $scope.title === '') { 
      return; 
    }

    posts.create({
      title: $scope.title,
      link: $scope.link,
      description: $scope.description,
    });
    $scope.title = '';
    $scope.link = '';
    $scope.description = '';
  };

  $scope.incrementUpvotes = function(post) {
    posts.upvote(post);
  };

  $scope.reduceUpvotes = function(post) {
    posts.downvote(post);
  };

}]);