App.controller("RentalCalculatorController", function($scope, RentalCalculator) {
    var vm = this;
    vm.input = {};
    vm.submit = function() {
      RentalCalculator.setData(vm.input);

      //To show and set the tabs view
      $( "#tabs" ).show().children().show();
      $("#tabs").tabs( "option","active", 1); 
    };

    //set up all input default values
    vm.input.loanInfoView = 'bankLoan';
    vm.input.loanInfoView

    /* 
     * Setting up defaults values for the rows 
     *  when the curly braces are added the track by $index knows to add one income form
     *  When no curly braces the form will not displayed until user adds it
     */
    vm.input.units = [{}];
    vm.input.supplementalIncomes = [{}];
    vm.input.specialTermsLoans = [{stl_interestOption: "no"}];
    vm.input.capitalExpenditures = [{}];
    vm.input.loans = [];
    vm.input.utilities = [];
    vm.input.expenses = [];

    vm.addUnit = function() {
      vm.input.units.push({});
    };
    vm.removeUnit = function() {
        var lastItem = vm.input.units.length-1;
        vm.input.units.splice(lastItem);
    };

    //To follow are all add or delete functions
    //I need to look into make them reusable here!!

    vm.addSupplementalIncome = function() {
      vm.input.supplementalIncomes.push({});
    };
    vm.removeSupplementalIncome = function() {
      var lastItem = vm.input.supplementalIncomes.length-1;
      vm.input.supplementalIncomes.splice(lastItem);
    };  

    vm.addSpecialTermsLoan = function() {
      vm.input.specialTermsLoans.push({stl_interestOption: "no"});
    };
    vm.removeSpecialTermsLoan = function() {
      var lastItem = vm.input.specialTermsLoans.length-1;
      vm.input.specialTermsLoans.splice(lastItem);
    }; 

    vm.addLoan = function() {
        vm.input.loans.push({add_bl_interestOnly: "no"});
      };
    vm.removeLoan = function() {
      var lastItem = vm.input.loans.length-1;
      vm.input.loans.splice(lastItem);
    };

    vm.addUtility = function() {
        vm.input.utilities.push({});
      };
    vm.removeUtility = function() {
      var lastItem = vm.input.utilities.length-1;
      vm.input.utilities.splice(lastItem);
    };

    vm.addExpense = function() {
      vm.input.expenses.push({});
    };
    vm.removeExpense = function() {
      var lastItem = vm.input.expenses.length-1;
      vm.input.expenses.splice(lastItem);
    };

    vm.addCapitalExpenditure = function() {
      vm.input.capitalExpenditures.push({});
    };
    vm.removeCapitalExpenditure = function() {
    var lastItem = vm.input.capitalExpenditures.length-1;
    vm.input.capitalExpenditures.splice(lastItem);
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