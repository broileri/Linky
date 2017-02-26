app.factory('scroller', ['$window', function($window) { 
     
    var scroller = {position: ""};

    scroller.setScrollPosition = function(id) {
     scroller.position = id;
    };


    scroller.getScrollPosition = function() {
      return scroller.position;
    };


  return scroller;
}])