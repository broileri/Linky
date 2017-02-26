var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: {type: String, maxlength: 200, minlength: 1},
  author: {type: String, required: true},
  votes: {type: Number, default: 0},
  voters: [{ user: String, voteValue: Number}],
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});


CommentSchema.methods.upvote = function(voter, userVoteId, cb) {
  
  if (userVoteId) {
    var vote = this.voters.id(userVoteId);
    vote.voteValue = 1;
    this.votes += 2;
  }
  else {
    this.voters.push({user: voter, voteValue: 1});
    this.votes += 1;
  }  
  this.save(cb);
}

CommentSchema.methods.downvote = function(voter, userVoteId, cb) {

  if (userVoteId) {
    var vote = this.voters.id(userVoteId);
    vote.voteValue = -1;
    this.votes -= 2;
  }
  else {
    this.voters.push({user: voter, voteValue: -1});
    this.votes -= 1;
  }  
  this.save(cb);
}

CommentSchema.pre('remove',function(next) {
    this.model('Post').update(
        { },
        { "$pull": { "comments": this._id } },
        { "multi": true },
        next
    );
})


mongoose.model('Comment', CommentSchema);