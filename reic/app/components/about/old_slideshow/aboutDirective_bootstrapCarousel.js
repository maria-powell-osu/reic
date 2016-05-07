App.directive('slideTransition', function($timeout) {
	return {
		link: function (scope, element, attrs) {
	      //timeout to make sure digest ends before calling scope.apply again
	      $timeout(function() {
	        //to make sure bindings get applied
	        scope.$apply( function () {
		        $('#myCarousel').carousel({
	                interval: 7000,
	                pause: "hover",
	                wrap: true
	            });
	            $('#myCarousel').on('click', '.carousel-control', handle_nav);

				  var handle_nav = function(e) {
				        e.preventDefault();
				        var nav = $(this);
				        nav.parents('.carousel').carousel(nav.data('slide'));
				  };
				//Add event handler for drag starter events to make them droppable for copies
				$('#myCarousel').bind('mouseenter', function (event) {
					$("#myCarousel").carousel('pause');
				});
				//Add event handler for drag end events for styling only
				$('#myCarousel').bind('mouseleave', function (event) {
					$('#myCarousel').carousel({
		                interval: 7000,
		                pause: "hover",
		                wrap: true
		            });
		        });
		    });
		});
	   }
	};
});