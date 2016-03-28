'use strict'

/*
 * Purpose: Prevents loading the file in case the User accidentaly drops it on wrong element
 * Code Exp.: 
 			- scope false is the default which means that the directive is in the same scope of the controller
 			- since this directive modifies DOM, we use link to register DOM listeners or update DOM
 			- .bind to add event handlers for drop and dragover events to element
			- preventDefault prevents the default behavior of the event
			- drop event: when an element or text selection is dropped on a valid drop target
			- dragover"fired when an element or text selection is being dragged over a valid drop target
 */
App.directive('preventDrop', function() {
	return {
		'scope': false,
		'link': function(scope, element, attrs) {			
			element.bind('drop dragover' function (event) {
				event.preventDefault();
			});
		}
	};
});

/*
 * Purpose: Prevents loading the file in case the User accidentaly drops it on wrong element
 * Code Exp.: 
 			
 */
App.directive('drop', function() {
  return {
    'scope': false,
    'require': '^flowInit',
    'link': function(scope, element, attrs) {
      if (attrs.flowDropEnabled) {
        scope.$watch(attrs.dropEnabled, function (value) {
          if (value) {
            assignDrop();
          } else {
            unAssignDrop();
          }
        });
      } else {
        assignDrop();
      }
      function assignDrop() {
        scope.$flow.assignDrop(element);
      }
      function unAssignDrop() {
        scope.$flow.unAssignDrop(element);
      }
    }
  };
});

/* Let's see if I really need this
 * Purpose: Changes color when file enters valid element
 * Code Exp.: 
 * Notes: http://www.codingeek.com/angularjs/angular-js-apply-timeout-digest-evalasync/
 */
/*App.directive('dragEnter', ['$timeout', function($timeout) {
    return {
      'scope': false,
      'link': function(scope, element, attrs) {
        var promise;
        //To control multi drops
        var enter = false;
        element.bind('dragover', function (event) {
        	//validates: Do I need this?
          if (!isFileDrag(event)) {
            return ;
          }
          if (!enter) {
          	//to update bindings
            scope.$apply(attrs.dragEnter);
            enter = true;
          }
          //here: ??
          $timeout.cancel(promise);
          event.preventDefault();
        });
        element.bind('dragleave drop', function (event) {
        	//here: ??
          $timeout.cancel(promise);
          promise = $timeout(function () {
            scope.$eval(attrs.dragLeave);
            promise = null;
            enter = false;
          }, 100);
        });
        function isFileDrag(dragEvent) {
          var fileDrag = false;
          var dataTransfer = dragEvent.dataTransfer || dragEvent.originalEvent.dataTransfer;
          angular.forEach(dataTransfer && dataTransfer.types, function(val) {
            if (val === 'Files') {
              fileDrag = true;
            }
          });
          return fileDrag;
        }
      }
    };*/