App.directive('slideTransition', function($timeout) {
	return {
		link: function (scope, element, attrs) {
	      //timeout to make sure digest ends before calling scope.apply again
	      $timeout(function() {
	        //to make sure bindings get applied
	        scope.$apply( function () {
		        $('#myCarousel').carousel({
	                interval: 5000,
	                pause: "hover",
	                wrap: true
	            });
				//Add event handler for drag starter events to make them droppable for copies
				$('#myCarousel').bind('mouseenter', function (event) {
					$("#myCarousel").carousel('pause');
				});
				//Add event handler for drag end events for styling only
				$('#myCarousel').bind('mouseleave', function (event) {
					$('#myCarousel').carousel({
		                interval: 5000,
		                pause: "hover",
		                wrap: true
		            });
		        });
		    });
		});
	   }
	};
});