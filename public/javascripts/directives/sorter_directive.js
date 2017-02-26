app.directive('sorter', function () {      
 
    return {
    restrict : 'C',
        link: function(scope, element) {
            element.bind("click" , function(e){
                 element.parent().find("span").removeClass("sorterEnabled");
                 element.addClass("sorterEnabled");
            });     
        }
    }
});