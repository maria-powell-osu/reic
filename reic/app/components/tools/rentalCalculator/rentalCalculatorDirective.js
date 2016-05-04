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

App.directive('rentalCalculations', function($timeout, RentalCalculator) {
  return {
    restrict: 'A',
    scope: {
      form: '=form',
    },
    link: function(scope, element, attrs, formCtrl) { 
      //timeout to make sure digest ends before calling scope.apply again
      $timeout(function() {
        //to make sure bindings get applied
        scope.$apply( function () {
          element.bind("click", function (event) {
            //loader to ensure user does not intefer with calculations
            $("#loaderBody").fadeIn(100);

            //var test = scope.form;
            var labels = RentalCalculator.calculate(scope.form);

            //When table creation completed take away the loader
            $('#loaderBody').fadeOut('slow', function () {});

            //this needs to happen differently
            //$( "#results" ).trigger( "click" );
            
            // if (result){
            //   //load the results page
            // } else {
            //   //error handling
            // }
          });
        });  
      });
    }
  };
});