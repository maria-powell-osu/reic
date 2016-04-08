App.controller("RentalCalculatorController", function($scope, RentalCalculator) {
    var vm = this;
    vm.input = {};
    vm.submit = function() {
      //To show and set the tabs view
      $( "#tabs" ).show().children().show();
      $("#tabs").tabs( "option","active", 1);

      RentalCalculator.setData(vm.input);
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
      var lastItem = vm.incomes.length-1;
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
    var lastItem = $scope.capitalExpenditures.length-1;
    vm.capitalExpenditures.splice(lastItem);
  };

});

App.controller('FileController', ['$scope', function ($scope){
	 $scope.imageFileName = '';
	 $scope.imgUpload = {};
	 $scope.imgUpload.src = '';
}]);

App.controller("RentalCalculatorCashFlowViewController", function($scope, RentalCalculator) {
  var vm = this;
  //get the user input
  vm.data = RentalCalculator.getData();
  
  // Load the Visualization API and the table package.
  google.charts.load('current', {'packages':['table']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(createTable);

  function createTable() {
    var data = new google.visualization.DataTable();
        //Create Columns
        //var columns = ["Year", "Income", "Expenses", "CAPEX", "Loan PMT", "Cash Flow ($)", "Cash on Cash (%)"];
        var columns = ["Year", "Income"];
        columns.forEach(function(column) {
            data.addColumn('number', column);
        });

        //Create Rows
        data.addRows(createDataRows(columns));
  
    var table = new google.visualization.Table(document.getElementById('table_div'));

    table.draw(data, {width: '100%', height: '100%'});
  }

  function getYears(){
    var years,
        view = vm.data.loanInfoView;

    if (view === "cash"){
      //aribitrarily set the years
      years = 30;
    } else if (view = "bankLoan"){
      years = parseInt(vm.data.bl_amortization) + 1;
    } else if (view = "specialTermsLoan") {
      years = parseInt(vm.data.stl_amortization) + 1;
    }
    return years;
  }

  function calculateFirstYearIncome (){
    var income,
        supplementalIncomes = vm.data.supplementalIncomes,
        units = vm.data.units,
        supplementalIncomesLength = Object.keys(supplementalIncomes).length,
        unitsLength = Object.keys(units).length,
        sumOfGrossMonthlySupplementalIncome = 0,
        sumOfGrossMonthlyUnitIncome = 0;

    for (var i = 0; i < supplementalIncomesLength; i++) {
        sumOfGrossMonthlySupplementalIncome += parseInt(supplementalIncomes[i].si_grossMonthlyIncome);
    }

    for (var i = 0; i < unitsLength; i++) {
      sumOfGrossMonthlyUnitIncome += parseInt(units[i].ri_grossMonthlyIncome);
    }

    income = (sumOfGrossMonthlySupplementalIncome + sumOfGrossMonthlyUnitIncome) * 12;

    return income;
  }

  function createDataRows (columns) {
    var dataRows = [],
        years = getYears();

    for (var i = 0; i < years; i++) {
      var row = [],
          //represents the income column
          income = 1;
      
      //Year Column Value
      row.push(i + 1);
      
      //Income Column Value
      if (i == 0){
        row.push(calculateFirstYearIncome());
      } else {
        row.push(dataRows[i-1][income] * ((parseInt(vm.data.ri_annualRentIncrease)/100) + 1));
      }

      dataRows.push(row);
    }
    return dataRows;
  }
});

App.controller("RentalCalculatorResultsController", function($scope) {
  $scope.tabCounter = 2;
});
