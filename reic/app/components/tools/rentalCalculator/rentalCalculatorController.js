App.controller("RentalCalculatorController", function($scope, RentalCalculator) {
    var vm = this;
    vm.input = {};
    vm.views = [
      {step: '1', view: 'basicInformation', displayName: 'Property Info'},
      {step: '2', view: 'loanInformation', displayName: 'Loan Info'},
      {step: '3', view: 'incomeSources', displayName: 'Income'}, 
      {step: '4', view: 'expenses', displayName: 'Expenses'},
      {step: '5', view: 'financialMeasures', displayName: 'Financial Measures'},
      {step: '6', view: 'results', displayName: 'Results'}
      ];
    vm.totalViews = vm.views.length;
    vm.progressbarId = "mpProgressBar";
    vm.currentView = 1;
    /*vm.submit = function() {
      RentalCalculator.setData(vm.input);
      var test = RentalCalculator.calculate();
    };*/

    //set up all input default values
    vm.input.loanInfoView = 'bankLoan';

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