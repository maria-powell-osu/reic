App.directive('clearForm', function() {
	return {
		scope: {},
		link: function (scope, element, attrs) {
			element.bind("click", function (event) {
				$("#dialog-confirm").dialog({
         resizable: false,
         height: 250,
         width: 400,
         modal: true,
         buttons: {
           "Clear Fields": function() {
            $('#rentalCalculatorInputForm')[0].reset();
            $(this).dialog("close");
          },
          Cancel: function() {
           $(this).dialog("close");
         }
       }
     });
			});
		}
	};

});

'use strict';

/* Basic Property Information
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('basicPropertyInformation', function() {
  return {
    templateUrl: '/reic/app/components/rentalCalculator/sectionViews/basicPropertyInformation.html'
  };
});

/* Cash Flow View
 * Calcul
 * 
 */
 App.directive('rentalCalculations', function($timeout, RentalCalculator) {
  return {
    restrict: 'A',
    /*controller: RentalCalculatorCashFlowViewController,*/
    link: function(scope, element, attrs, ctrl) { 
      //timeout to make sure digest ends before calling scope.apply again
      $timeout(function() {
        //to make sure bindings get applied
        scope.$apply( function () {

          // Load the Visualization API and the table package. 
          google.charts.load('current', {'packages':['table', 'corechart']});
          
          $("#tabs").tabs({
            activate: function (event, ui) {
              if(ui.newTab.index() == 1){
                //loader to ensure user does not intefer with calculations
                //ToDo: add error handling 
                var vm = this;
                vm.data = scope.rentalCalculator.input;
                //vm.data = RentalCalculator.getData();
                
                createTable();
                createCashFlowProjectionComboChart();
                createIncomePieChart();
                createExpensePieChart();

                //When table creation completed take away the loader
                $('#loaderBody').fadeOut('slow', function () {});
              
                function createExpensePieChart(){
                  var expensePieChart = new google.visualization.PieChart(document.getElementById('expensePieChart')),
                      dataArray = [],
                      monthlyExpenses = 0,
                      yearlyExpenses = 0,
                      expenseResult = 0,
                      addedUtilities = vm.data.addedUtilities || [],
                      addedUtilitiesLength = Object.keys(addedUtilities).length,
                      colorArray = [
                      '#FF3349', 
                      '#FF8333', 
                      '#FFE933', 
                      '#AFFF33', 
                      '#49FF33', 
                      '#33FF83', 
                      '#333CFF', 
                      '#11580C', 
                      '#090405', 
                      '#A4B2A3', 
                      '#BB7D10', 
                      '#650C86'
                    ];

                      //add columns to the data 
                      dataArray.push(["Description", "ExpenseAmount"]);

                      if (vm.data.u_water){
                        dataArray.push(["Water", vm.data.u_water]);
                      }
                      if (vm.data.u_sewer){
                        dataArray.push(["Sewer", vm.data.u_sewer]);
                      }
                      if (vm.data.u_garbage){
                        dataArray.push(["Garbage", vm.data.u_garbage]);
                      }
                      if (vm.data.u_electricity){
                        dataArray.push(["Electricity", vm.data.u_electricity]);
                      }
                      if (vm.data.u_naturalGas){
                        dataArray.push(["Natural Gas", vm.data.u_naturalGas]);
                      }
                      if (vm.data.u_internet){
                        dataArray.push(["Internet", vm.data.u_internet]);
                      }
                      if (vm.data.m_costAmount){
                        dataArray.push(["Cost Amount", vm.data.m_costAmount]);
                      }
                      if (vm.data.o_yardMaintenance){
                        dataArray.push(["Yard Maintenance", vm.data.o_yardMaintenance]);
                      }
                      if (vm.data.o_insurance){
                        dataArray.push(["Insurance", vm.data.o_insurance]);
                      }
                      if (vm.data.pm_managementFeeAmount || (vm.data.pm_tenantPlacementFee && vm.data.o_vacancyRate)){
                        var tenantFee = vm.data.pm_tenantPlacementFee || 0,
                            vacancyRate = vm.data.o_vacancyRate || 0,
                            monthlyTenantFee = tenantFee * vacancyRate,
                            managementFee = vm.data.pm_managementFeeAmount + monthlyTenantFee;
                        
                        dataArray.push(["Property Management", managementFee]);
                      }
                      if (vm.data.o_propertyTaxes){
                        var propTaxes = vm.data.o_propertyTaxes / 12;
                        dataArray.push(["Property Taxes", propTaxes]);
                      }
                      if (vm.data.o_vacancyRate){
                        var vacancyRate = vm.data.o_vacancyRate / 100,
                            //we are dividing by 12 because the function return income per year
                            income = calculateFirstYearIncome() /12,
                            vacancyPerMonth = income * vacancyRate;
                            dataArray.push(["Vacancy", vacancyPerMonth]);
                      }

                      //add up all monthly custom utility costs added by User
                      for (var i = 0; i < addedUtilitiesLength; i++) {
                        dataArray.push([addedUtilities[i].add_u_name, addedUtilities[i].add_u_amount]);
                      }

                var data = google.visualization.arrayToDataTable(dataArray);

                //Since we do not like the google charts legend label display, 
                //I am creating our own (create the label array and bind to the view)
                scope.expensePieChartsLabels = createLabelArray(colorArray, dataArray, headerDescriptionIsSet = true);


                var options = {
                    width: '100%', 
                    height: '100%',
                    is3D: true,
                    legend: "none",
                    pieSliceText: 'none',
                    colors: colorArray
                };

                  expensePieChart.draw(data, options);
                }

                function createIncomePieChart(){
                  var incomePieChart = new google.visualization.PieChart(document.getElementById('incomePieChart')),
                      dataArray = [],
                      units = vm.data.units || []
                      unitsLength = Object.keys(units).length,
                      supplementalIncomes = vm.data.supplementalIncomes || [],
                      supplementalIncomesLength = Object.keys(supplementalIncomes).length,
                      sumOfGrossMonthlyUnitIncome = 0,
                      colorArray = [
                      '#FF3349', 
                      '#FF8333', 
                      '#FFE933', 
                      '#AFFF33', 
                      '#49FF33', 
                      '#33FF83', 
                      '#333CFF', 
                      '#11580C', 
                      '#090405', 
                      '#A4B2A3', 
                      '#BB7D10', 
                      '#650C86'
                    ];

                  //add columns to the data 
                  dataArray.push(["Description", "IncomeAmount"]);

                  //add unit income
                  for (var i = 0; i < unitsLength; i++) {
                    sumOfGrossMonthlyUnitIncome += units[i].ri_grossMonthlyIncome;
                  }
                  dataArray.push(["Rental Income", sumOfGrossMonthlyUnitIncome]);              

                  //add new row for each supplemental income
                  for (var i = 0; i < supplementalIncomesLength; i++) {
                    var description = supplementalIncomes[i].si_description,
                        value = supplementalIncomes[i].si_grossMonthlyIncome;
                    dataArray.push([description, value]);
                  }
                  var data = google.visualization.arrayToDataTable(dataArray);
                  
                  //Since we do not like the google charts legend label display, 
                  //I am creating our own (create the label array and bind to the view)
                  scope.incomePieChartsLabels = createLabelArray(colorArray, dataArray, headerDescriptionIsSet = true);

                  var options = {
                    width: '100%', 
                    height: '100%',
                    is3D: true,
                    legend: "none",
                    fontSize: 11,
                    pieSliceText: 'none',
                    colors: colorArray
                  };

                  incomePieChart.draw(data, options);
                }

                /*
                 * Description: Helper function to create labels for pie charts
                 *                This was create because default goog chart labels suck
                 * Params:      Colors: colors used in the pie chart so I can add color coding)
                 *              Data: the sections added into the pie charts
                 *              headerDescription: e.g. for the pie charts we set up the array to contain description
                 *                                 of the data in the first position of the array and we would not want
                 *                                 this for our labels so we need to take it out if flag is true       
                 */
                function createLabelArray (colors, data, headerDescriptionIsSet){
                  var result = [],
                      errormsg,
                      descIndex = 0,
                      valueIndex = 1;

                      //if the data array contains description header
                      //then take out the first row
                      if(headerDescriptionIsSet){
                        data.shift();
                      }

                      //Create the label array with colors in it
                      for (var i = 0; i < data.length; i++){ 
                          //check data format
                          if(typeof(data[i][descIndex]) == 'undefined' 
                            || typeof(data[i][valueIndex]) == 'undefined'){
                            //TODO: throw error
                          }else {
                            var description = data[i][descIndex],
                                value = data[i][valueIndex],
                                colorIndex = 0,
                                temp;
                                
                                //when we have more data sections then colors
                                //we start to reloop the colors
                                if(colors.length >= i) {
                                  colorIndex = i;
                                } else {
                                  colorIndex = i - (colors.length - 1);
                                }

                            result.push({description:description, value:value, color:colors[colorIndex]});
                          }
                    
                      }
                  return result;
                }
                function createCashFlowProjectionComboChart() {
                  var cashFlowProjectionChart = new google.visualization.ComboChart(document.getElementById('cashFlowProjection_div')),
                  rawDataArray = vm.data.cashFlowTableData,
                  cashFlow = 5,
                  year = 0,
                  cashOnCash = 6,
                  chartData = [];

                  //specify axis information
                  var options = {
                    series: {
                      0: {axis: 'CashFlow', type: 'bars'}, 
                      1: {axis: 'CashOnCash', type: 'line', targetAxisIndex:1}
                    },
                    axes: {
                      y: {
                        CashFlow: {label: 'Cash Flow ($)'},
                        CashOnCash: {label: 'Cash on Cash (%)'}
                      }
                    },
                    hAxis: {title: 'Years'},
                    width: '100%', 
                    height: '100%'
                  };

                  //add columns to the data 
                  chartData.push(["Year", "Cash Flow ($)", "Cash on Cash (%)"]);

                  //Add data rows to the data
                  rawDataArray.forEach(function(row) {
                    var dataRow = [];
                    dataRow.push(row[year]);
                    dataRow.push(row[cashFlow]);
                    dataRow.push(row[cashOnCash]);
                    chartData.push(dataRow);
                  });
                  var data = google.visualization.arrayToDataTable(chartData);
                  cashFlowProjectionChart.draw(data, options);
                }

                function createTable() {
                  var data = new google.visualization.DataTable();
                      //Create Columns
                      var columns = ["Year", "Income", "Expenses", "CAPEX ", "Loan PMT", "Cash Flow", "Cash on Cash"];
                      columns.forEach(function(column) {
                        data.addColumn('number', column);
                      });

                      //Create Rows
                      data.addRows(createDataRows(columns));

                      var table = new google.visualization.Table(document.getElementById('table_div'));

                      table.draw(data, {width: '100%', height: '300px'});
                    }


                /*
                 * Helper Function:
                 * Creates the data that goes into each columns
                 */
                 function createDataRows (columns) {
                  var dataRows = [],
                  years = getYears(),
                  capitalExpenditures = calculateCapitalExpenditures(years),
                  capExSumUpUntilNow = 0,
                  loanPmts = calculateLoanPmts(years),
                  incomeColumn = 1,
                  expenseColumn = 2,
                  lenderPointsSum = sumOfSpecialTermsLenderPoints(),
                  loanSum = sumOfSpecialTermsLoanAmounts(vm.data.loanInfoView);


                  for (var i = 0; i < years; i++) {
                    var column = [],
                        incomeData,
                        cashFlowData,
                        cashOnCashData,
                        expenseData;

                        yearData = i + 1;
                        incomeData = calculateIncome(i, dataRows, incomeColumn);
                        expenseData = calculateExpenses(i, dataRows, expenseColumn, incomeData);
                        capExData = capitalExpenditures[i],
                        loanPaymentData = loanPmts[i],
                        cashFlowData = incomeData - expenseData - capExData - loanPaymentData;

                        capExSumUpUntilNow += capExData;
                        cashOnCashData = calculateCashOnCash(cashFlowData, capExSumUpUntilNow, lenderPointsSum, loanSum);

                        column.push(yearData);
                        column.push(incomeData);
                        column.push(expenseData);
                        column.push(capExData);
                        column.push(loanPaymentData)
                        column.push(cashFlowData);
                        column.push(cashOnCashData );
                        dataRows.push(column);
                      }
                      vm.data.cashFlowTableData = dataRows;
                      return dataRows;
                    }

                function calculateIncome (year, dataRows, incomeColumn) {
                  var incomeResult,
                      rentIncrease = vm.data.ri_annualRentIncrease || 0;

                    if (year == 0){
                          incomeResult = calculateFirstYearIncome();
                        } else {
                          incomeResult = dataRows[year-1][incomeColumn] * ((rentIncrease/100) + 1);
                        }
                  return incomeResult;
                }

                function calculateExpenses (year, dataRows, expenseColumn, incomeData){
                  var expenseResult,
                      expenseIncrease = vm.data.e_annualExpenseIncrease || 0;
                  if (year == 0){
                    expenseResult = calculateFirstYearExpense(incomeData);
                  } else {
                    expenseResult = dataRows[year-1][expenseColumn] * ((expenseIncrease/100) + 1);
                  }
                  return expenseResult;
                }

                /*
                 * Helper Function
                 * Gets the amount of years for the data results
                 * Years pretty much mean rows in the table
                 * for special terms loans and bank loans the highest
                 *  amortization get chosen
                 */
                 function getYears(){
                  var years = 0,
                  view = vm.data.loanInfoView;

                  if (view === "cash"){
                    //aribitrarily set the years
                    years = 30;
                  } else if (view === "bankLoan"){
                    var maxValue = vm.data.bl_amortization || 0,
                    addedBankLoans = vm.data.loans || [],
                    addedBankLoansLength = Object.keys(addedBankLoans).length;

                    for (var i = 0; i < addedBankLoansLength; i++) {
                      if (addedBankLoans[i].add_bl_amortization > maxValue) {
                        maxValue = addedBankLoans[i].add_bl_amortization;
                      }
                    }
                    years = maxValue + 1;
                  } else if (view === "specialTermsLoan") {
                    var maxValue = 0,
                    specialTermsLoans = vm.data.specialTermsLoans || [],
                    specialTermsLoansLength = Object.keys(specialTermsLoans).length;

                    for (var i = 0; i < specialTermsLoansLength; i++) {
                      var amortization = specialTermsLoans[i].stl_amortization || 0;
                      if (amortization > maxValue) {
                        maxValue = amortization;
                      }
                    }
                    years = maxValue + 1;
                  }
                  return years;
                }

                function calculateCashOnCash (cashFlowData, capExSumData, lenderPointsSum, loanSum){
                  var cashOnCashResult,
                  view = vm.data.loanInfoView,
                  addedBankLoans = vm.data.loans || [],
                  closingCost = vm.data.bl_closingCost || 0,
                  dividend = cashFlowData,
                  divisor,
                  addedBankLoansLength = Object.keys(addedBankLoans).length;

                  if (view === "cash"){
                    divisor = capExSumData + vm.data.li_purchasePrice;

                  } else if (view === "bankLoan"){
                    //If there is only one bankloan
                    if (addedBankLoansLength == 0){
                      divisor = capExSumData + vm.data.bl_downPaymentDollar + closingCost;
                    } else {
                      divisor = capExSumData + lenderPointsSum + vm.data.bl_downPaymentDollar + closingCost;
                    }
                  } else if (view === "specialTermsLoan"){
                    divisor = capExSumData + lenderPointsSum + (vm.data.li_purchasePrice - loanSum);
                  }

                  if (divisor <= 0){
                    cashOnCashResult = 0;
                  }else {
                    //* 100 to display in percentage format                
                    cashOnCashResult = (dividend / divisor) * 100;
                  }
                  return cashOnCashResult;
                }

                function calculateBalloonPayoff (){
                  var ballonPayoffResult;

                  return ballonPayoffResult;
                }

                function sumOfSpecialTermsLenderPoints(){
                  var lenderPointsSumResult = 0,
                  addedBankLoans = vm.data.loans || [],
                  addedBankLoansLength = Object.keys(addedBankLoans).length;

                  for (var i = 0; i < addedBankLoansLength; i ++){
                    lenderPointsSumResult += addedBankLoans[i].add_bl_upFrontLenderPoints || 0;
                  }
                  return lenderPointsSumResult;
                }

                function sumOfSpecialTermsLoanAmounts(view ){
                  var specialTermsLoanAmountsResult = 0,
                  addedBankLoans = vm.data.loans || [],
                  addedBankLoansLength = Object.keys(addedBankLoans).length,
                  specialTermsLoans = vm.data.specialTermsLoans || [],
                  specialTermsLoansLength = Object.keys(specialTermsLoans).length;

                  if (view == "bankLoan"){
                    for (var i = 0; i < addedBankLoansLength; i ++){
                      specialTermsLoanAmountsResult += addedBankLoans[i].add_bl_loanAmount;
                    }
                  }else if (view == "specialTermsLoan"){
                    for (var i = 0; i < specialTermsLoansLength; i ++){
                      specialTermsLoanAmountsResult += specialTermsLoans[i].stl_amount;
                    }
                  }
                  return specialTermsLoanAmountsResult;
                }

                function amortizationCalculation (r, p, n) {
                  var dividend = (r * (Math.pow((1 + r),n)));
                  var divisor = ((Math.pow((1 + r), n)) - 1);

                  return p * (dividend / divisor);
                }

                function calculateLoanPmts (years) {
                  var loanPmtResult = 0,
                  view = vm.data.loanInfoView,
                  addedBankLoans = vm.data.loans || [],
                  addedBankLoansLength = Object.keys(addedBankLoans).length,
                  specialTermsLoans = vm.data.specialTermsLoans || [],
                  specialTermsLoansLength = Object.keys(specialTermsLoans).length,
                  r,
                  p,
                  n;

                  if(view == "cash"){
                   loanPmtResult = 0;

                 } else if (view == "bankLoan"){
                      //Add Bank Loan
                      p = vm.data.li_purchasePrice - vm.data.bl_downPaymentDollar;
                      r = (vm.data.bl_interest /100) / 12; 
                      n = vm.data.bl_amortization * 12;
                      loanPmtResult += (amortizationCalculation(r, p, n) * 12);

                      //Added Bank Loans
                      for (var i = 0; i < addedBankLoansLength; i++) {
                        if (addedBankLoans[i].add_bl_interestOnly == "yes"){
                          loanPmtResult += addedBankLoans[i].add_bl_loanAmount * (addedBankLoans[i].add_bl_interest / 100);
                        } else if (addedBankLoans[i].add_bl_interestOnly == "no"){
                          p = addedBankLoans[i].add_bl_loanAmount;
                          r = (addedBankLoans[i].add_bl_interest/100) / 12;
                          n = addedBankLoans[i].add_bl_amortization * 12;
                          loanPmtResult += (amortizationCalculation(r, p, n) * 12);
                        }
                      }
                    } else if (view == "specialTermsLoan"){
                      for (var i = 0; i < specialTermsLoansLength; i++) {
                        if (vm.data.specialTermsLoans[i].stl_interestOption == "yes"){
                          loanPmtResult += vm.data.specialTermsLoans[i].stl_amount * (vm.data.specialTermsLoans[i].stl_interest / 100);
                        } else if (vm.data.specialTermsLoans[i].stl_interestOption == "no"){
                          p = vm.data.specialTermsLoans[i].stl_amount;
                          r = (vm.data.specialTermsLoans[i].stl_interest /100)/ 12;
                          n = vm.data.specialTermsLoans[i].stl_amortization * 12;
                          loanPmtResult += (amortizationCalculation(r, p, n) * 12);
                        }
                      }
                    }

                    var result = Array.apply(null, Array(years)).map(Number.prototype.valueOf, loanPmtResult);

                    return result;
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
                  }
                }
              });
            });
          });
        }
      }
    });

/* Financial Measures 
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('financialMeasures', function() {
  return {
    templateUrl: '/reic/app/components/rentalCalculator/sectionViews/financialMeasures.html'
  };
});


/* Loan Information
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('loanInformation', function() {
  return {
    templateUrl: '/reic/app/components/rentalCalculator/sectionViews/loanInformation.html'
  };
});


/* Income Sources
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('incomeSources', function() {
  return {
    templateUrl: '/reic/app/components/rentalCalculator/sectionViews/incomeSources.html'
  };
});

/* Expenses
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('expenses', function() {
  return {
    templateUrl: '/reic/app/components/rentalCalculator/sectionViews/expenses.html'
  };
});

 App.directive('removeTab', function($compile) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, ctrl) {  
      $(element).click( function () {
        scope.$apply( function () {
          var tabs = $("#tabs").tabs();
          var panelId = tabs.find(".ui-tabs-active").remove().attr("aria-controls");
          $('#' + panelId).remove();
          $("#tabs").tabs('refresh');
        });
      });
    }
  }
});




