'use strict';

/* Basic Property Information
 * Loads template into analyzedeal.html
 */
App.directive('basicPropertyInformation', function() {
  return {
    templateUrl: '/reic/views/templates/basicPropertyInformation.html'
  };
});

/* Loan Information
 * Loads template into analyzedeal.html
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

/* Loan Information - Cash View
 * Loads template into loanInformation.html
 */
App.directive('cashView', function() {
  return {
    templateUrl: '/reic/views/templates/loanInformationViews/cashView.html'
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
 * Loads template into analyzedeal.html
 */
App.directive('incomeSources', function() {
  return {
    templateUrl: '/reic/views/templates/incomeSources.html'
  };
});

/* Expenses
 * Loads template into analyzedeal.html
 */
App.directive('expenses', function() {
  return {
    templateUrl: '/reic/views/templates/expenses.html'
  };
});




