'use strict';

/* Basic Property Information
 * Loads template into rentalCalculatorInput.html
 */
App.directive('basicPropertyInformation', function() {
  return {
    templateUrl: '/reic/views/templates/basicPropertyInformation.html'
  };
});

/* Financial Measures 
 * Loads template into rentalCalculatorInput.html
 */
App.directive('financialMeasures', function() {
  return {
    templateUrl: '/reic/views/templates/financialMeasures.html'
  };
});


/* Rental Calculator Input 
 * Loads template into rentalcalculator.html
 */
App.directive('rentalCalculatorInput', function() {
  return {
    templateUrl: '/reic/views/templates/rentalcalculatorinput.html'
  };
});


/* Loan Information
 * Loads template into rentalCalculatorInput.html
 */
App.directive('loanInformation', function() {
  return {
    templateUrl: '/reic/views/templates/loanInformation.html'
  };
});

/* Loan Information - Bank Loan View
 * Loads template into loanInformation.html
 */
App.directive('bankLoanView', function() {
  return {
    templateUrl: '/reic/views/templates/loanInformationViews/bankLoanView.html'
  };
});

/* Loan Information - Bank Loan View
 * Loads template into loanInformation.html
 */
App.directive('specialTermsLoanView', function() {
  return {
    templateUrl: '/reic/views/templates/loanInformationViews/specialTermsLoanView.html'
  };
});

/* Income Sources
 * Loads template into rentalCalculatorInput.html
 */
App.directive('incomeSources', function() {
  return {
    templateUrl: '/reic/views/templates/incomeSources.html'
  };
});

/* Expenses
 * Loads template into rentalCalculatorInput.html
 */
App.directive('expenses', function() {
  return {
    templateUrl: '/reic/views/templates/expenses.html'
  };
});




