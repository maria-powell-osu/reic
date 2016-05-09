App.controller("RentalCalculatorController", function($scope, RentalCalculator) {
    var vm = this;
    vm.input = {};
    vm.calculating = false;
    vm.steps = [
      {
        index: 0, view: "bp", display: "Property Info"
      },
      {
        index: 1, view: "li", display: "Loan Info"
      },
      {
        index: 2, view: "in", display: "Income"
      },
      {
        index: 3, view: "exp", display: "Expenses"
      },
      {
        index: 4, view: "res", display: "Result"
      },
    ];
    vm.totalSteps = vm.steps.length;
    vm.currStep = vm.steps[0].index; //Initialize default Views
    vm.currView = vm.steps[vm.currStep].view;
    
    //Progress Step Bar Functions
    vm.next = function (){
      vm.currStep = RentalCalculator.nextStep(vm.currStep, vm.totalSteps);
      vm.currView = vm.steps[vm.currStep].view;
    };
    vm.jumpTo = function (jumpToIndex, form){
      var previousIndex = jumpToIndex != 0 ? jumpToIndex - 1 : jumpToIndex; 
      if(form[vm.steps[previousIndex].view].$valid)  {
        //Here we need to see if the step was ac
        if(jumpToIndex === vm.totalSteps - 1){
          vm.calculate(form);
        } else {
          vm.currStep = RentalCalculator.jumpTo(jumpToIndex);
          vm.currView = vm.steps[vm.currStep].view;
        }
      }
    };
    vm.prev = function (){
      vm.currStep = RentalCalculator.prevStep(vm.currStep);
      vm.currView = vm.steps[vm.currStep].view;
    };
    vm.calculate = function (form){
      if(form.$valid)  {
        //Get the data for the tables, graphs etc.
        var results = RentalCalculator.calculate(vm.input);

        //A watch has been added in the mp-charts directive that triggers drawing of the graphs
        vm.chartData = results;

        //Route to the results page
        vm.currStep = vm.totalSteps - 1;
        vm.currView = vm.steps[vm.currStep].view;
      }
    }
    

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

    //set up all input default values
    vm.input.loanInfoView = 'bankLoan';

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