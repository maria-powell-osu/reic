App.directive('clearForm', function() {
	return {
		scope: {},
		link: function (scope, element, attrs) {
			element.bind("click", function (event) {
				$("#dialog-confirm").dialog({
	                resizable: false,
	                height: 250,
	                width: 400,
	                modal: true,
	                buttons: {
	                    "Clear Fields": function() {
	                    	$('#rentalCalculatorInputForm')[0].reset();
	                        $(this).dialog("close");
	                    },
	                    Cancel: function() {
	                        $(this).dialog("close");
	                    }
	                }
	            });
			});
		}
	};

});

'use strict'

App.directive('goToCashFlow', function($compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {  
            $(element).click( function () {
            	scope.$apply( function () {
            		//elements to add to the tabs (compile is needed so that the directives get attached)
            		var li = $compile('<li><a href="#tabs-cashFlow">Cash Flow</a> <span class="glyphicon glyphicon-remove" aria-hidden="true" remove-tab></span></li>')(scope);
    				var div = $compile('<div id="tabs-cashFlow" cash-flow></div>')(scope);

    				var tabs = $('#tabs').tabs();
    				var tabCounter = scope['tabCounter'];
    				tabCounter++;

    				tabs.find(".ui-tabs-nav").append(li);
    				tabs.append(div);
    				tabs.tabs('refresh');
    				$("#tabs").tabs( "option","active", tabCounter - 1);
            	});
    		});
		}
	}
});

'use strict';

/* Basic Property Information
 * Loads template into rentalCalculatorInput.html
 */
App.directive('basicPropertyInformation', function() {
  return {
    templateUrl: '/reic/app/components/rentalCalculator/sectionViews/basicPropertyInformation.html'
  };
});

/* Cash Flow View
 * 
 */
App.directive('cashFlow', function() {
  return {
    templateUrl: '/reic/app/components/rentalCalculator/resultViews/cashflow.html'
  };
});

/* Financial Measures 
 * Loads template into rentalCalculatorInput.html
 */
App.directive('financialMeasures', function() {
  return {
    templateUrl: '/reic/app/components/rentalCalculator/sectionViews/financialMeasures.html'
  };
});


/* Loan Information
 * Loads template into rentalCalculatorInput.html
 */
App.directive('loanInformation', function() {
  return {
    templateUrl: '/reic/app/components/rentalCalculator/sectionViews/loanInformation.html'
  };
});


/* Income Sources
 * Loads template into rentalCalculatorInput.html
 */
App.directive('incomeSources', function() {
  return {
    templateUrl: '/reic/app/components/rentalCalculator/sectionViews/incomeSources.html'
  };
});

/* Expenses
 * Loads template into rentalCalculatorInput.html
 */
App.directive('expenses', function() {
  return {
    templateUrl: '/reic/app/components/rentalCalculator/sectionViews/expenses.html'
  };
});

App.directive('removeTab', function($compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {  
            $(element).click( function () {
              scope.$apply( function () {
                var tabs = $("#tabs").tabs();
                var panelId = tabs.find(".ui-tabs-active").remove().attr("aria-controls");
            $('#' + panelId).remove();
            $("#tabs").tabs('refresh');
              });
        });
    }
  }
});




