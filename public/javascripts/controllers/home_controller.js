app.controller('HomeController', ['$scope', 'posts', 'votes', 'userinfo', 'scroller', function($scope, posts, votes, userinfo, scroller) {  
  $scope.isLoggedIn = userinfo.isLoggedIn;

  $scope.posts = posts.posts;

  $scope.link ='http://';

  $scope.order = "-votes";

  $scope.setScrollPosition = scroller.setScrollPosition; 

  // RegExp by https://gist.github.com/dperini/729294#file-regex-weburl-js-L59
  $scope.validLink = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  $scope.$watch('posts', function(newVal, oldVal) {

    if (newVal.length == oldVal.length + 1) {
      var newPostId = newVal[newVal.length - 1]._id;
      setTimeout(function(){ showNewPost(newPostId); }, 200);
    }

  }, true);


  showNewPost = function(id) {
    var elem =  $('#' + id);
    elem.addClass('flashNew');
    $('html, body').animate({ scrollTop: elem.offset().top }, 200);
    setTimeout( function() { elem.removeClass('flashNew'); }, 1000);
  };


  angular.element(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip(); // initialize tooltips
    $("#linkField").bind({ // empty link field on paste
      paste : function(){
        $("#linkField").val("");
      }
    })
    for (var i = 0; i < $scope.posts.length; i++) {
      for (var j = 0; j < $scope.posts[i].voters.length; j++) {
        if ($scope.posts[i].voters[j].user == userinfo.currentUser()) {
          votes.colorUsersVotes($scope.posts[i]._id, "post", $scope.posts[i].voters[j].voteValue); // marks posts the user has voted on
          break;
        }
      }
    }
  });


  $scope.setOrder = function (order) {
    $scope.order = order;
  };


  $scope.addPost = function(){

    if (  (!$scope.title || $scope.title === '') || 
          (!$scope.link || !$scope.validLink.test($scope.link) || $scope.link == '' || $scope.link.length > 300) ||
          ($scope.description && $scope.description.length > 200) ) 
      { return; }
   

    var newPost = {title: $scope.title, link: $scope.link, author: 'user', description: $scope.description};

    posts.create(newPost);
    clearFormFields();    
  };


  clearFormFields = function() {
    $scope.title = '';
    $scope.link = 'http://';
    $scope.description = '';
    $scope.linkForm.$setPristine();
    $scope.linkForm.$setUntouched();
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


  $scope.toggleLinkText = function() {

    var collapseLink = $('#commentFormOpener');
    var collapseForm = $('#collapseOne');

    if ( collapseLink.text() == "+ New Post" && !collapseForm.hasClass('in') && !collapseForm.hasClass('collapsing') ) {    
      collapseLink.text("- Hide");
      return;  
      
    }
    if ( collapseLink.text() == "- Hide" && collapseForm.hasClass('in') ) {    
      collapseLink.text("+ New Post");      
    }
  }
}]);