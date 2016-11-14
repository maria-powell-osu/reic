	'use strict';

	//Navigation Bar: Need to Add Active Button Still
	App.directive('mpTopNavBar', ['$location', function(location) {
		return {
			restrict: 'E',
			templateUrl: '/app/shared/navbar/navbar.html',
			link: function (scope,element, attrs, ctrl){
				$('.navbar-collapse a').click(function(){
					$(".navbar-collapse").collapse('hide');

				});
				scope.isActive = function (viewLocation) { 
			        return viewLocation === location.path();
			    };
			}
		};
	}]);