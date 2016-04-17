App.controller("RentalCalculatorController", function($scope, RentalCalculator) {
    var vm = this;
    vm.input = {};
    vm.submit = function() {
      RentalCalculator.setData(vm.input);

      //To show and set the tabs view
      $( "#tabs" ).show().children().show();
      $("#tabs").tabs( "option","active", 1); 
    };

    //set the default value for loan information
    vm.input.loanInfoView = 'bankLoan';

    /* 
     * Setting up defaults values for the rows 
     *  when the curly braces are added the track by $index knows to add one income form
     *  When no curly braces the form will not displayed until user adds it
     */
    vm.units = [{}];
    vm.supplementalIncomes = [{}];
    vm.specialTermsLoans = [{}];
    vm.capitalExpenditures = [{}];
    vm.loans = [];
    vm.utilities = [];
    vm.expenses = [];

    vm.addUnit = function() {
      vm.units.push({});
    };
    vm.removeUnit = function() {
        var lastItem = vm.units.length-1;
        vm.units.splice(lastItem);
    };

    //To follow are all add or delete functions
    //I need to look into make them reusable here!!

    vm.addSupplementalIncome = function() {
      vm.supplementalIncomes.push({});
    };
    vm.removeSupplementalIncome = function() {
      var lastItem = vm.supplementalIncomes.length-1;
      vm.supplementalIncomes.splice(lastItem);
    };  

    vm.addSpecialTermsLoan = function() {
      vm.specialTermsLoans.push({});
    };
    vm.removeSpecialTermsLoan = function() {
      var lastItem = vm.specialTermsLoans.length-1;
      vm.specialTermsLoans.splice(lastItem);
    }; 

    vm.addLoan = function() {
        vm.loans.push({});
      };
    vm.removeLoan = function() {
      var lastItem = vm.loans.length-1;
      vm.loans.splice(lastItem);
    };

    vm.addUtility = function() {
        vm.utilities.push({});
      };
    vm.removeUtility = function() {
      var lastItem = vm.utilities.length-1;
      vm.utilities.splice(lastItem);
    };

    vm.addExpense = function() {
      vm.expenses.push({});
    };
    vm.removeExpense = function() {
      var lastItem = vm.expenses.length-1;
      vm.expenses.splice(lastItem);
    };

    vm.addCapitalExpenditure = function() {
      vm.capitalExpenditures.push({});
    };
    vm.removeCapitalExpenditure = function() {
    var lastItem = vm.capitalExpenditures.length-1;
    vm.capitalExpenditures.splice(lastItem);
  };

});

App.controller('FileController', ['$scope', function ($scope){
	 $scope.imageFileName = '';
	 $scope.imgUpload = {};
	 $scope.imgUpload.src = '';
}]);

/*App.controller("RentalCalculatorCashFlowViewController", function($scope, RentalCalculator) {
  var vm = this;
  //get the user input
  vm.data = RentalCalculator.getData();
  $scope.test = "test";
  
  });*/


/*App.controller("RentalCalculatorResultsController", function($scope) {
  $scope.tabCounter = 2;
});*/
