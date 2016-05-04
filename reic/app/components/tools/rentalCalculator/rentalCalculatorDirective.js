/* Basic Property Information
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('basicPropertyInformation', function() {
  return {
    templateUrl: '/reic/app/components/tools/rentalCalculator/sectionViews/basicPropertyInformation.html'
  };
});

/* Loan Information
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('loanInformation', function() {
  return {
    templateUrl: '/reic/app/components/tools/rentalCalculator/sectionViews/loanInformation.html'
  };
});


/* Income Sources
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('incomeSources', function() {
  return {
    templateUrl: '/reic/app/components/tools/rentalCalculator/sectionViews/incomeSources.html'
  };
});

/* Expenses
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('expenses', function() {
  return {
    templateUrl: '/reic/app/components/tools/rentalCalculator/sectionViews/expenses.html'
  };
});

/* Financial Measures 
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('financialMeasures', function() {
  return {
    templateUrl: '/reic/app/components/tools/rentalCalculator/sectionViews/financialMeasures.html'
  };
});

 /* Results
 * Loads template into result.html
 */
 App.directive('results', function() {
  return {
    templateUrl: '/reic/app/components/tools/rentalCalculator/sectionViews/results.html'
  };
});

 App.directive('mpCashFlowProjectionTable', function() {
  return {
    restrict: 'E',  /*only matches directive with element name*/
    scope: {
      data: '=data',
    },
    link: function (scope, $elm, $attr) {
      var data = scope.data;
    }
  };
});

