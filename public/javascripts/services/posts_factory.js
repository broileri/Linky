app.factory('posts', ['$http', 'userinfo', '$window', '$location', function($http, userinfo, $window, $location) {

  var o = {posts: []};

  o.getAll = function() {
    return $http.get('/posts').success(function(data) {
      angular.copy(data, o.posts);
    });
  };


  o.create = function(post) {
    return $http.post('/posts', post, {
      headers: {Authorization: 'Bearer '+userinfo.getToken()}
    }).then(function(response){
      o.posts.push(response.data);
      //$location.hash(response.data._id);
    });
  };


  o.upvote = function(post, voter, userVoteId) {
    return $http.put('/posts/' + post._id + '/upvote', {voter, userVoteId}, {
      headers: {Authorization: 'Bearer '+userinfo.getToken()}
    }).then(function(response){
      post.voters = response.data.voters;
      post.votes = response.data.votes;
    });
  };


  o.downvote = function(post, voter, userVoteId) {
    return $http.put('/posts/' + post._id + '/downvote', {voter, userVoteId}, {
      headers: {Authorization: 'Bearer '+userinfo.getToken()}
    }).then(function(response){
      post.voters = response.data.voters;
      post.votes = response.data.votes;
    });
  };


  o.get = function(id) {
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
    });
  };


  // To do: only author can delete, server side 
  o.deletePost = function(id) {
    return $http.delete('/posts/' + id, null, {
      headers: {Authorization: 'Bearer '+userinfo.getToken()}
    }).success(function(res){
      $window.location.href = '/#/home'; // redirecting back home after deletion
    });
  };


    // To do: only author can delete, server side + delete references in a post instance
  o.deleteComment = function(post, comment) {
    return $http.delete('/posts/' + post._id + '/comments/'+ comment._id, null, {
      headers: {Authorization: 'Bearer '+userinfo.getToken()}
    }).then(function(response){            

      for (var i = 0; i < post.comments.length; i++) {
        if (post.comments[i]._id == comment._id) {
          post.comments.splice(i, 1);
          break;
        }
      }
    });
  };


  o.addComment = function(post, comment) {
    return $http.post('/posts/' + post._id + '/comments', comment, {
      headers: {Authorization: 'Bearer '+userinfo.getToken()}
    }).then(function(response){
      //o.posts.push(response.data);
      post.comments.push(response.data);
      //$location.hash(response.data._id);
    });
  };

  o.upvoteComment = function(post, comment, voter, userVoteId) {
    return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', {voter, userVoteId}, {
      headers: {Authorization: 'Bearer '+userinfo.getToken()}
    }).then(function(response){
      comment.voters = response.data.voters;
      comment.votes = response.data.votes;
    });
  };

  o.downvoteComment = function(post, comment, voter, userVoteId) {
    return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/downvote', {voter, userVoteId}, {
      headers: {Authorization: 'Bearer '+userinfo.getToken()}
    }).then(function(response){
      comment.voters = response.data.voters;
      comment.votes = response.data.votes;
    });
  };



  return o;
}]);