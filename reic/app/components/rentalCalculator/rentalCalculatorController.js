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
        var columns = ["Year", "Income", "Expenses", "CAPEX"];
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
      years = vm.data.bl_amortization + 1;
    } else if (view = "specialTermsLoan") {
      years = vm.data.stl_amortization + 1;
    }
    return years;
  }

  function createDataRows (columns) {
    var dataRows = [],
        years = getYears(),
        capitalExpenditures = calculateCapitalExpenditures(years),
        incomeColumn = 1,
        expenseColumn = 2;


    for (var i = 0; i < years; i++) {
      var column = [],
          yearData = i + 1,  //the +1 is to display years starting at 1
          capExData = capitalExpenditures[i],
          incomeData,
          expenseData;
      
      if (i == 0){
        incomeData = calculateFirstYearIncome();

        expenseData = calculateFirstYearExpense(incomeData);

      } else {
        incomeData = dataRows[i-1][incomeColumn] * ((vm.data.ri_annualRentIncrease/100) + 1);
        expenseData = dataRows[i-1][expenseColumn] * (vm.data.e_annualExpenseIncrease/100);
      }

      column.push(yearData);
      column.push(incomeData);
      column.push(expenseData);
      column.push(capExData);
      dataRows.push(column);
    }
    return dataRows;
  }

  function calculateCapitalExpenditures (years) {
    var capitalExpenditures = vm.data.capitalExpenditures || [],
        capitalExpendituresLength = Object.keys(capitalExpenditures).length,
        purchasDateYear = new Date(vm.data.li_purchaseDate).getFullYear();

    //Initialize the result array to 0 and set length of array to how many years
    var capExpArray = Array.apply(null, Array(years)).map(Number.prototype.valueOf, 0);
    
    for (var i = 0; i < capitalExpendituresLength; i++) {
      var capExpYear = (new Date(capitalExpenditures[i].ce_date)).getFullYear();
      var capExpPosition = capExpYear - purchasDateYear;
      if(capExpPosition <= capExpArray.length){
        capExpArray[capExpPosition] = vm.data.capitalExpenditures[i].ce_cost;
      }
    }
    return capExpArray;
  }

  function calculateFirstYearExpense (firstYearIncome){
    var monthlyExpenses = 0,
        yearlyExpenses = 0,
        expenseResult = 0,
        addedUtilities = vm.data.addedUtilities || [],
        //DO TO HERE SHOULD BE ERROR HANDLING INSTEAD
        water = vm.data.u_water || 0,
        sewer = vm.data.u_sewer || 0,
        garbage = vm.data.u_garbage || 0,
        electricity = vm.data.u_electricity || 0,
        naturalGas = vm.data.u_naturalGas || 0,
        internet = vm.data.u_internet || 0,
        maintenanceCost = vm.data.m_costAmount || 0,
        yardMaitenance = vm.data.o_yardMaintenance || 0,
        insurance = vm.data.o_insurance || 0,
        managementFee = vm.data.pm_managementFeeAmount || 0,
        tenantPlacementFee = vm.data.pm_tenantPlacementFee || 0,
        propertyTaxes = vm.data.o_propertyTaxes || 0,
        addedUtilitiesLength = Object.keys(addedUtilities).length,
        vacancyRate = (vm.data.o_vacancyRate || 0) / 100;

        //add up all monthly default utility costs and 
        monthlyExpenses = water + sewer + garbage
                  + electricity + naturalGas
                  + internet + maintenanceCost
                  + yardMaitenance + insurance
                  + managementFee;

        //add up all monthly custom utility costs added by User
        for (var i = 0; i < addedUtilitiesLength; i++) {
          monthlyExpenses += addedUtilities[i].add_u_amount;
        }

        //convert all monthly expenses to yearly cost 
        yearlyExpenses = 12 * ((tenantPlacementFee * vacancyRate)
                        + monthlyExpenses);

        //add the rest of yearly expenses
        expenseResult = yearlyExpenses + propertyTaxes
                        + (vacancyRate * firstYearIncome);

    return expenseResult;
  }


  function calculateFirstYearIncome (){
      var income,
          supplementalIncomes = vm.data.supplementalIncomes || [],
          units = vm.data.units || [],
          supplementalIncomesLength = Object.keys(supplementalIncomes).length,
          unitsLength = Object.keys(units).length,
          sumOfGrossMonthlySupplementalIncome = 0,
          sumOfGrossMonthlyUnitIncome = 0;

      for (var i = 0; i < supplementalIncomesLength; i++) {
          sumOfGrossMonthlySupplementalIncome += supplementalIncomes[i].si_grossMonthlyIncome;
      }

      for (var i = 0; i < unitsLength; i++) {
        sumOfGrossMonthlyUnitIncome += units[i].ri_grossMonthlyIncome;
      }

      income = (sumOfGrossMonthlySupplementalIncome + sumOfGrossMonthlyUnitIncome) * 12;

      return income;
    }
  });


App.controller("RentalCalculatorResultsController", function($scope) {
  $scope.tabCounter = 2;
});
