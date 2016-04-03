App.controller("RentalCalculatorSubmitFormController", function($scope, $location) {
    $scope.submit = function() {
    	$( "#tabs" ).show().children().show();
    	 $("#tabs").tabs( "option","active", 1 );
    	
    };
});
