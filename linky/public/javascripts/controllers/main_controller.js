app.controller('MainController', ['$scope', 'posts', 'auth', function($scope, posts, auth) {
  
  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.posts = posts.posts;

  $scope.addPost = function(){

    if(!$scope.title || $scope.title === '') { 
      return; 
    }

    // RegExp by https://gist.github.com/dperini/729294#file-regex-weburl-js-L59
    var validURL = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    if (!$scope.link || !validURL.test($scope.link)) {
      console.log("not valid link");
      return;
    }


    posts.create({
      title: $scope.title,
      link: $scope.link,
      author: 'user',
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