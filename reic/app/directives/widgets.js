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
            $timeout(function() {   //<--- used $timeout to make sure ng-repeat is REALLY finished
                var content = $('#accordion .ui-accordion-content ');

                // add the accordion functionality
                $('#accordion .accordion-header').click(function() {
                    var panel = $(this).next();
                    var isOpen = panel.is(':visible');
                 
                    panel[isOpen? 'slideUp': 'slideDown']()
                        // toggle between hide and show
                        .trigger(isOpen? 'hide': 'show');

                    // this prevents a pagescroll
                    return false;
                });

                //This function expands all sections
                //function expandAll (){
                    /*var isAllOpen = $(this).data('isAllOpen');
                    
                    $('#accordion .ui-accordion-content ')[isAllOpen? 'hide': 'show']()
                        .trigger(isAllOpen? 'hide': 'show');*/
                //}

                //function hideAll(){
/*                        var isAllOpen = !content.is(':hidden');
*/                        /*if(!isAllOpen){
                            expandLink.text('Expand all')
                            .data('isAllOpen', false);
                        } */
                    //}

                // when panels open or close, check to see if they're all open
                //content.on({
                    // whenever we open a panel, check to see if they're all open
                    // if all open, swap the button to collapser
                    //show: function(){
/*                        var isAllOpen = !content.is(':hidden');   
*/                        /*if(isAllOpen){
                            expandLink.text('Collapse All')
                                .data('isAllOpen', true);
                        }*/
                  //  }
                //});
            });
        }
    };
});