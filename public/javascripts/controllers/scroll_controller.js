app.controller('ScrollController', ['$scope', '$window', '$document', '$location', 'scroller', function($scope, $window, $document, $location, scroller) {




    $scope.$on('$stateChangeSuccess', function () {

        // setting scroll position to anchor
        var elemId = scroller.getScrollPosition();
        if (elemId.length > 0) {

          $('html, body').animate({
               scrollTop: $(elemId).offset().top
            }, 200);
          scroller.setScrollPosition("");
        }       
        
    });


	$document.on('scroll', function() {
	    if ($window.scrollY > 100) {
	    	$('#back-to-top').fadeIn();
        } 
        else {
            $('#back-to-top').fadeOut();
        }
	});

	$scope.goToTop = function() {
        $('body,html').animate({ scrollTop: 0 }, 200);
	}


	

}]);