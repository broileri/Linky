app.controller('PostsController', ['$scope', 'posts', 'post', 'auth',	function($scope, posts, post, auth) {

	$scope.post = post;
  $scope.isLoggedIn = auth.isLoggedIn;
  
	
  $scope.addComment = function() {
    
    if($scope.body === '') { 
      return; 
    }

    posts.addComment(post._id, {
      body: $scope.body,
      author: 'user',
    }).success(function(comment) {
      $scope.post.comments.push(comment);
    });
    $scope.body = '';
  };


  $scope.deletePost = function() {
    if (!post.author === auth.currentUser()) {
      return;
    }
    posts.deletePost(post._id);
  };

  $scope.incrementUpvotes = function(comment) {
    posts.upvoteComment(post, comment);
  };

  $scope.reduceUpvotes = function(comment) {
    posts.downvoteComment(post, comment);
  };

  $scope.currentUserIsAuthor = function() {    
    return post.author === auth.currentUser();
  }; 

 


}]);