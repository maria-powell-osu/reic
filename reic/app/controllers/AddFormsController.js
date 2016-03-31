App.controller('AddFormsController', ['$scope', function ($scope){
	$scope.units = [];

	$scope.units = [{id: 'unit1'}];

	$scope.addUnit = function() {
	    var newUnitNo = $scope.units.length + 1;
	    $scope.units.push({'id':'unit'+ newUnitNo});
  	};

  	$scope.removeChoice = function() {
    var lastItem = $scope.units.length-1;
    $scope.units.splice(lastItem);
  };
}]);