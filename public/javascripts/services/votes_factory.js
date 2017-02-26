app.factory('votes', ['userinfo', function(userinfo) {

  var o = {votes: []};

  o.upvote = function(post, posts) {

    if (!userinfo.hasVoted(post, "upvotedPosts")) {
     userinfo.vote(post, "upvotedPosts");

      var userVoteId = null;
      for (var i = 0; i < post.voters.length; i++) {
        if (post.voters[i].user == userinfo.currentUser()) { 
          if (post.voters[i].voteValue == 1) {
            return;
          }
          userVoteId = post.voters[i]._id;         
          break;
        }
      }
      posts.upvote(post, userinfo.currentUser(), userVoteId);
      userinfo.removeVote(post, "downvotedPosts");
    }
  };


  o.downvote = function(post, posts) {

    if (!userinfo.hasVoted(post, "downvotedPosts")) {
      userinfo.vote(post, "downvotedPosts");

      var userVoteId = null;
      for (var i = 0; i < post.voters.length; i++) {
        if (post.voters[i].user == userinfo.currentUser()) { 
          if (post.voters[i].voteValue == -1) {
            return;
          }
          userVoteId = post.voters[i]._id;         
          break;
        }
      }
      posts.downvote(post, userinfo.currentUser(), userVoteId);
      userinfo.removeVote(post, "upvotedPosts");
    } 
  };


  o.upvoteComment = function(comment, post, posts) {

    if (!userinfo.hasVoted(comment, "upvotedComments")) {
     userinfo.vote(comment, "upvotedComments");

      var userVoteId = null;
      for (var i = 0; i < comment.voters.length; i++) {
        if (comment.voters[i].user == userinfo.currentUser()) { 
          if (comment.voters[i].voteValue == 1) {
            return;
          }
          userVoteId = comment.voters[i]._id;         
          break;
        }
      }
      posts.upvoteComment(post, comment, userinfo.currentUser(), userVoteId);
      userinfo.removeVote(comment, "downvotedComments");
   }
  };

  o.downvoteComment = function(comment, post, posts) {
    if (!userinfo.hasVoted(comment, "downvotedComments")) {
      userinfo.vote(comment, "downvotedComments");

      var userVoteId = null;
      for (var i = 0; i < comment.voters.length; i++) {
        if (comment.voters[i].user == userinfo.currentUser()) { 
          if (comment.voters[i].voteValue == -1) {
            return;
          }
          userVoteId = comment.voters[i]._id;         
          break;
        }
      }
      posts.downvoteComment(post, comment, userinfo.currentUser(), userVoteId);
      userinfo.removeVote(comment, "upvotedComments");
    }     
  };


  o.colorUsersVotes = function(id, postOrComment, vote) {
    var name = postOrComment;
    if (vote == 1) {
      $("#"+id+"-up"+name).css("color", "#004d99");
      $("#"+id+"-down"+name).css("color", "");
    }
    else {
      $("#"+id+"-up"+name).css("color", "");
      $("#"+id+"-down"+name).css("color", "#990000");
    }
  }

  return o;
}]);