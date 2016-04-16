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

/*App.directive('goToCashFlow', function($compile) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs, ctrl) {  
      $(element).click( function () {
       scope.$apply( function () {
            		//elements to add to the tabs (compile is needed so that the directives get attached)
            		var li = $compile('<li><a href="#tabs-cashFlow">Cash Flow</a> <span class="glyphicon glyphicon-remove" aria-hidden="true" remove-tab></span></li>')(scope);
                var div = $compile('<div id="tabs-cashFlow" cash-flow></div>')(scope);

                var tabs = $('#tabs').tabs();
                var tabCounter = scope['tabCounter'];
                tabCounter++;

                tabs.find(".ui-tabs-nav").append(li);
                tabs.append(div);
                tabs.tabs('refresh');
                $("#tabs").tabs( "option","active", tabCounter - 1);

                alert("here");
                alert("this is it");
              });
     });
    }
  }
});*/

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
          google.charts.load('current', {'packages':['table']});
          
          $("#tabs").tabs({
            activate: function (event, ui) {
              if(ui.newTab.index() == 1){
                //loader to ensure user does not intefer with calculations
                //ToDo: add error handling 
                $("#loaderBody").fadeIn(100);
                var vm = this;
                vm.data = RentalCalculator.getData();
                
                createTable();
                //When table creation completed take away the loader
                $('#loaderBody').fadeOut('slow', function () {});
                
                // Set a callback to run when the Google Visualization API is loaded.
                //google.charts.setOnLoadCallback(createTable);

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

                  table.draw(data, {width: '100%', height: '100%'});
                }
                

                /*
                 * Helper Function:
                 * Creates the data that goes into each columns
                 */
                function createDataRows (columns) {
                  var dataRows = [],
                      years = getYears(),
                      capitalExpenditures = calculateCapitalExpenditures(years),
                      capExSumData = 0,
                      loanPmts = calculateLoanPmts(years),
                      incomeColumn = 1,
                      expenseColumn = 2,
                      lenderPointsSum = sumOfSpecialTermsLenderPoints(),
                      loanSum = sumOfSpecialTermsLoanAmounts(vm.data.loanInfoView);


                  for (var i = 0; i < years; i++) {
                    var column = [],
                        yearData = i + 1,  //the +1 is to display years starting at 1
                        capExData = capitalExpenditures[i],
                        loanPaymentData = loanPmts[i],
                        incomeData,
                        cashFlowData,
                        cashOnCashData,
                        expenseData,
                        rentIncrease = vm.data.ri_annualRentIncrease || 0,
                        expenseIncrease = vm.data.e_annualExpenseIncrease || 0;
                    
                    if (i == 0){
                      incomeData = calculateFirstYearIncome();

                      expenseData = calculateFirstYearExpense(incomeData);

                    } else {
                      incomeData = dataRows[i-1][incomeColumn] * ((rentIncrease/100) + 1);
                      expenseData = dataRows[i-1][expenseColumn] * ((expenseIncrease/100) + 1);
                    }

                    cashFlowData = incomeData - expenseData - capExData - loanPaymentData;
                    
                    capExSumData += capExData;
                    cashOnCashData = calculateCashOnCash(cashFlowData, capExSumData, lenderPointsSum, loanSum);

                    column.push(yearData);
                    column.push(incomeData);
                    column.push(expenseData);
                    column.push(capExData);
                    column.push(loanPaymentData)
                    column.push(cashFlowData);
                    column.push(cashOnCashData );
                    dataRows.push(column);
                  }
                  return dataRows;
                }

                /*
                 * Helper Function
                 * Gets the amount of years for the data results
                 * Years pretty much mean rows in the table
                 * for special terms loans and bank loans the highest
                 *  amortization get chosen
                 */
                function getYears(){
                  var years,
                      view = vm.data.loanInfoView;

                  if (view === "cash"){
                    //aribitrarily set the years
                    years = 30;
                  } else if (view === "bankLoan"){
                    var maxValue = vm.data.bl_amortization,
                        addedBankLoans = vm.data.addedLoans || [],
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
                        if (specialTermsLoans[i].stl_amortization > maxValue) {
                            maxValue = specialTermsLoans[i].stl_amortization;
                        }
                    }
                    years = maxValue + 1;
                  }
                  return years;
                }

                function calculateCashOnCash (cashFlowData, capExSumData, lenderPointsSum, loanSum){
                  var cashOnCashResult,
                      view = vm.data.loanInfoView,
                      addedBankLoans = vm.data.addedLoans || [],
                      closingCost = vm.data.bl_closingCost || 0;
                      addedBankLoansLength = Object.keys(addedBankLoans).length;

                  if (view === "cash"){
                    cashOnCashResult = (cashFlowData) / (capExSumData + vm.data.li_purchasePrice);

                  } else if (view === "bankLoan"){
                    //If there is only one bankloan
                    if (addedBankLoansLength == 0){
                      cashOnCashResult = (cashFlowData) / (capExSumData + vm.data.bl_downPaymentDollar + closingCost);
                    } else {
                      cashOnCashResult = (cashFlowData) / (capExSumData + lenderPointsSum + vm.data.bl_downPaymentDollar + closingCost);
                    }

                  } else if (view === "specialTermsLoan"){
                    cashOnCashResult = (cashFlowData) / (capExSumData + lenderPointsSum + (vm.data.li_purchasePrice - loanSum));
                  }

                  //to display it as percentage
                  cashOnCashResult = cashOnCashResult * 100;
                  return cashOnCashResult;
                }

                function sumOfSpecialTermsLenderPoints(){
                  var lenderPointsSumResult = 0,
                      addedBankLoans = vm.data.addedLoans || [],
                      addedBankLoansLength = Object.keys(addedBankLoans).length;

                  for (var i = 0; i < addedBankLoansLength; i ++){
                    lenderPointsSumResult += addedBankLoans[i].add_bl_upFrontLenderPoints || 0;
                  }
                  return lenderPointsSumResult;
                }

                function sumOfSpecialTermsLoanAmounts(view ){
                  var specialTermsLoanAmountsResult = 0,
                      addedBankLoans = vm.data.addedLoans || [],
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

                function sumCapExUpToYear (endPoint, capExArray){
                  var sumOfCapExResult = 0;
                    for (var i = 0; i <= endPoint; i++){
                      sumOfCapExResult += capExpArray[i];
                    }
                  return sumOfCapExResult;
                }

                function amortizationCalculation (r, p, n) {
                  var dividend = (r * (Math.pow((1 + r),n)));
                  var divisor = ((Math.pow((1 + r), n)) - 1);

                  return p * (dividend / divisor);
                }

                function calculateLoanPmts (years) {
                  var loanPmtResult = 0,
                      view = vm.data.loanInfoView,
                      addedBankLoans = vm.data.addedLoans || [],
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
                        if (addedBankLoans[i].add_bl_interestOption == "yes"){
                          loanPmtResult += addedBankLoans[i].add_bl_loanAmount * (addedBankLoans[i].add_bl_interest / 100);
                        } else if (addedBankLoans[i].add_bl_interestOption == "no"){
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




