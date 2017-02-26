var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: {type: String, required: true, maxlength: 140},
  link: {type: String, required: true, maxlength: 300},
  description: {type: String, maxlength: 200},
  author: {type: String, required: true},
  votes: {type: Number, default: 0},
  voters: [{ user: String, voteValue: Number}],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});


PostSchema.methods.upvote = function(voter, userVoteId, cb) {
  
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

PostSchema.methods.downvote = function(voter, userVoteId, cb) {

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


// Remove comments related to a post
PostSchema.pre('remove', function(next) {
    this.model('Comment').remove({ post: this._id }, next);
});



mongoose.model('Post', PostSchema);