'use strict';

//Navigation Bar: Need to Add Active Button Still
App.directive('mpFooter', function() {
  return {
  	restrict: 'E',
    templateUrl: '/app/shared/footer/footer.html'
  };
});

App.directive('mpCurrentYear', function() {
	return {
		restrict: 'E',
		link: function($scope, $element, $attrs) {
			var d = new Date();
			$element.text(d.getFullYear());
		}
	};
});