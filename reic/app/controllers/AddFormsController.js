App.controller('AddUnitController', ['$scope', function ($scope){

	$scope.units = [{id: 'unit1'}];

	$scope.addUnit = function() {
	    var newUnitNo = $scope.units.length + 1;
	    $scope.units.push({'id':'unit'+ newUnitNo});
  	};

  	$scope.removeUnit = function() {
    var lastItem = $scope.units.length-1;
    $scope.units.splice(lastItem);
  };
}]);

App.controller('AddSupplementalIncomeController', ['$scope', function ($scope){

	$scope.incomes = [{id: 'income1'}];

	$scope.addIncome = function() {
	    var newNo = $scope.incomes.length + 1;
	    $scope.incomes.push({'id':'income'+ newNo});
  	};

  	$scope.removeIncome = function() {
    var lastItem = $scope.incomes.length-1;
    $scope.incomes.splice(lastItem);
  };
}]);

App.controller('AddUtilityController', ['$scope', function ($scope){

	$scope.utilities = [];

	$scope.addUtility = function() {
	    var newNo = $scope.utilities.length + 1;
	    $scope.utilities.push({'id':'income'+ newNo});
  	};

  	$scope.removeUtility = function() {
    var lastItem = $scope.utilities.length-1;
    $scope.utilities.splice(lastItem);
  };
}]);

App.controller('AddExpenseController', ['$scope', function ($scope){

	$scope.expenses = [];

	$scope.addExpense = function() {
	    var newNo = $scope.expenses.length + 1;
	    $scope.expenses.push({'id':'expense'+ newNo});
  	};

  	$scope.removeExpense = function() {
    var lastItem = $scope.expenses.length-1;
    $scope.expenses.splice(lastItem);
  };
}]);

App.controller('AddCapitalExpenditureController', ['$scope', function ($scope){

	$scope.capitalExpenditures = [{id: 'capitalExpenditure1'}];

	$scope.addCapitalExpenditure = function() {
	    var newNo = $scope.capitalExpenditures.length + 1;
	    $scope.capitalExpenditures.push({'id':'capitalExpenditure'+ newNo});
  	};

  	$scope.removeCapitalExpenditure = function() {
    var lastItem = $scope.capitalExpenditures.length-1;
    $scope.capitalExpenditures.splice(lastItem);
  };
}]);