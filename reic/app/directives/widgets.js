'use strict'

App.directive('jqdatepicker', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            $(element).datepicker({
                dateFormat: 'dd.mm.yy',
                changeMonth: true,
                changeYear: true,
                onSelect: function(date) {
                    ctrl.$setViewValue(date);
                    ctrl.$render();
                    scope.$apply();
                }
            });
        }
    };
});

App.directive('jqSlideSection', function($timeout) {
    return {
        link: function(scope, element, attrs, ctrl) {
            //$timeout to make sure everything is loaded properly before this
            $timeout(function() {   
                //if you want to hide them at some point do:
                //$('#accordion .ui-accordion-content ').hide();

                // header click event
                $('#accordion .accordion-header').click(function() {
                    //gets the sibling element which is the content of the header
                    var contentOfHeader = $(this).next();
                    var isContentOpen = contentOfHeader.is(':visible');
                 
                    contentOfHeader[isContentOpen? 'slideUp': 'slideDown']()
                        // toggle between hide and show
                        .trigger(isContentOpen? 'hide': 'show');

                    // this prevents a pagescroll
                    return false;
                });
            });
        }
    };
});

App.directive('jqTabs', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            $timeout(function() {  
                $(element).tabs();
                $(element).tabs( "disable", 1 );
            });
        }
    };
});