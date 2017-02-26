app.factory('userinfo', ['$http', '$window', function($http, $window){ // $http for server, $window for localStorage
     var userinfo = {};

     userinfo.saveToken = function (token) {
       $window.localStorage['linky-token'] = token;
     };

     userinfo.getToken = function () {
       return $window.localStorage['linky-token'];
     }

     userinfo.isLoggedIn = function(){
       var token = userinfo.getToken();

       if(token){
         var payload = JSON.parse($window.atob(token.split('.')[1]));

         return payload.exp > Date.now() / 1000;
       } else {
         return false;
       }
     };

    userinfo.currentUser = function(){
      if(userinfo.isLoggedIn()){
        var token = userinfo.getToken();
        var payload = JSON.parse(b64DecodeUnicode(token.split('.')[1])); //JSON.parse($window.atob(token.split('.')[1]));
        return payload.username;
      }
    };

    // http://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
    function b64DecodeUnicode(str) {
      return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    }

    userinfo.register = function(user){
      return $http.post('/register', user).success(function(data){
        userinfo.saveToken(data.token);
        $window.localStorage['upvotedPosts'] = "";
        $window.localStorage['downvotedPosts'] = "";
        $window.localStorage['upvotedComments'] = "";
        $window.localStorage['downvotedComments'] = "";
      });
    };  
    
    userinfo.logIn = function(user){
      return $http.post('/login', user).success(function(data){
        userinfo.saveToken(data.token);
        $window.localStorage['upvotedPosts'] = "";
        $window.localStorage['downvotedPosts'] = "";
        $window.localStorage['upvotedComments'] = "";
        $window.localStorage['downvotedComments'] = "";
      });
    }; 

    userinfo.logOut = function(){
      $window.localStorage.removeItem('linky-token');
      $window.localStorage.removeItem('upvotedPosts');
      $window.localStorage.removeItem('downvotedPosts');
      $window.localStorage.removeItem('upvotedComments');
      $window.localStorage.removeItem('downvotedComments');
    };




    // Saving the user's post and comment votes to prevent vote spamming the server via quick clicking

    userinfo.hasVoted = function(postOrComment, voteCollection) {
      
      if ($window.localStorage.getItem(voteCollection).length == 0) {return false;}
      var voteArray = JSON.parse($window.localStorage.getItem(voteCollection));
      
      for (var i = 0; i < voteArray.length; i++) {
        if (voteArray[i] == postOrComment._id) {
          return true;
        }
      }
      return false;
    }
    
    userinfo.vote = function(postOrComment, voteCollection) {
            
      if ($window.localStorage.getItem(voteCollection).length == 0) {
        var voteArray = [];
      } 
      else {
      var voteArray = JSON.parse($window.localStorage.getItem(voteCollection));  
      }
      for (var i = 0; i < voteArray.length; i++) {

        if (voteArray[i] == postOrComment._id) {
          return;
        }
      }
      voteArray.push(postOrComment._id);
      $window.localStorage.setItem(voteCollection, JSON.stringify(voteArray));
    }


    userinfo.removeVote = function (postOrComment, voteCollection) {
      
      if ($window.localStorage.getItem(voteCollection).length == 0) {return;}
      var voteArray = JSON.parse($window.localStorage.getItem(voteCollection));
      for (var i = 0; i < voteArray.length; i++) {
        if(voteArray[i] == postOrComment._id) {
          voteArray.splice(i, 1);
          $window.localStorage.setItem(voteCollection, JSON.stringify(voteArray));
          return;
        }
      }
    }


  return userinfo;
}])