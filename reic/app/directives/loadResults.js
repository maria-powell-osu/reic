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
