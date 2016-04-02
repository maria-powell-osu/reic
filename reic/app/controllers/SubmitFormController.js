App.controller("RentalCalculatorSubmitFormController", function($scope, $location) {
    $scope.submit = function() {
    	$location.path("/results" );
    };
});
