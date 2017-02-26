app.controller('PostsController', ['$scope', 'posts', 'post', 'votes', 'userinfo', 'orderByFilter', '$window', function($scope, posts, post, votes, userinfo, orderBy, $window) {

	$scope.post = post;
  $scope.isLoggedIn = userinfo.isLoggedIn;
  $scope.order = "-votes";


  $scope.$watch('post', function(newVal, oldVal) {
    if (newVal.comments.length == oldVal.comments.length + 1) {
      var newCommentId = newVal.comments[newVal.comments.length - 1]._id;
      setTimeout(function(){ showNewComment(newCommentId); }, 200);
    }

  }, true);

  var showNewComment = function(id) {
    var elem =  $('#' + id);
    elem.addClass('flashNewComment');
    $('html, body').animate({ scrollTop: elem.offset().top }, 200);
    setTimeout( function() { elem.removeClass('flashNewComment'); }, 1000);
  };


  angular.element(document).ready(function () {

    // marks the post if the user has rated it
    for (var i = 0; i < $scope.post.voters.length; i++) {
      if ($scope.post.voters[i].user == userinfo.currentUser()) {
        votes.colorUsersVotes($scope.post._id, "post", $scope.post.voters[i].voteValue); 
      }
    }


    // marks comments the user has rated
    for (var i = 0; i < $scope.post.comments.length; i++) {
      for (var j = 0; j < $scope.post.comments[i].voters.length; j++) {
        if ($scope.post.comments[i].voters[j].user == userinfo.currentUser()) {
          votes.colorUsersVotes(
            $scope.post.comments[i]._id, 
            "comment", 
            $scope.post.comments[i].voters[j].voteValue); 
          break;
        }
      }
    }

  });


  $scope.$on('$stateChangeSuccess', function () {

    // setting the values for the previous/next buttons
    var orderedPosts = orderBy(posts.posts, '_id', $scope.reverse);

    for (var i = 0; i < orderedPosts.length; i++) {
      if (orderedPosts[i]._id == post._id) {
        if (i > 0) { $scope.previousPost = orderedPosts[i-1]._id }
        if (i < orderedPosts.length-1) { $scope.nextPost = orderedPosts[i+1]._id }
        break;
      }
    }
  });


  $scope.goToPost = function(postId) {
    $window.location.href = '/#/posts/' + postId;
  };


  $scope.setOrder = function (order) {
    $scope.order = order;
  };  


  $scope.shortenLink = function() {    
    
    if (post.link.length > 50) {      
      return post.link.slice(0, 50) + '...';      
    }
    return post.link;
  };

	
  $scope.addComment = function() {
    if(!$scope.commentBox || $scope.commentBox == '') { 
      return; 
    }

    var newComment = {body: $scope.commentBox, author: 'user'};
    posts.addComment(post, newComment);
    $scope.commentBox = '';
    $scope.commentForm.$setPristine();
    $scope.commentForm.$setUntouched();
  };


  $scope.deletePost = function() {
    if (!post.author === userinfo.currentUser()) {
      return;
    }
    posts.deletePost(post._id);
  };


  $scope.deleteComment = function(comment) {
    if (!comment.author === userinfo.currentUser()) {
      return;
    }  
    posts.deleteComment(post, comment);
  };


  $scope.upvote = function(post) {

    if (!userinfo.isLoggedIn()) {
      alert("Using this feature requires logging in.");
      return;
    }

    votes.upvote(post, posts);
    votes.colorUsersVotes(post._id, "post", 1);
  };


  $scope.downvote = function(post) {

    if (!userinfo.isLoggedIn()) {
      alert("Using this feature requires logging in.");
      return;
    }

    votes.downvote(post, posts);
    votes.colorUsersVotes(post._id, "post", -1);
  };


  $scope.upvoteComment = function(comment) {

    if (!userinfo.isLoggedIn()) {
      alert("Using this feature requires logging in.");
      return;
    }

    votes.upvoteComment(comment, post, posts);
    votes.colorUsersVotes(comment._id, "comment", 1);   
  };


  $scope.downvoteComment = function(comment) {

    if (!userinfo.isLoggedIn()) {
      alert("Using this feature requires logging in.");
      return;
    }

    votes.downvoteComment(comment, post, posts);
    votes.colorUsersVotes(comment._id, "comment", -1);       
  };


  $scope.currentUserIsAuthor = function() {    
    return post.author === userinfo.currentUser();
  };


  $scope.currentUserIsCommenter = function(commenter) {
    return userinfo.currentUser() === commenter;
  };


  $scope.toggleLinkText = function() {

    var collapseLink = $('#commentFormOpener');
    var collapseForm = $('#collapseOne');

    if ( collapseLink.text() == "+ Add a Comment" && !collapseForm.hasClass('in') && !collapseForm.hasClass('collapsing') ) {    
      collapseLink.text("- Hide");
      return;  
      
    }
    if ( collapseLink.text() == "- Hide" && collapseForm.hasClass('in') ) {    
      collapseLink.text("+ Add a Comment");      
    }
  };


}]);