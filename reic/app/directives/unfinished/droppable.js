'use strict'

App.directive('droppable', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            $(element).droppable({
                //accept: "#draggable",
                activeClass: "ui-state-hover",
                hoverClass: "ui-state-active",
                drop: function( event, ui ) {
                    $( this )
                    .addClass( "ui-state-highlight" )
                    scope.$apply();
                }
            });
        }
    };
});

'use strict'

App.directive('draggable', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            $(element).draggable();
        }
    };
});

