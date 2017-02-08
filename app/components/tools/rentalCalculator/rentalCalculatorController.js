App.controller("RentalCalculatorController", function($scope, RentalCalculator, SEO) {
    var vm = this;
    vm.input = {};  
    vm.view = "loan";
    var titleTag = "Rental Property Calculator | Plan Passive";
    var metaTag = 'Use the best fee rental property calculator online. See customized graphs and charts of your cash flow, total return, and cash on equity over time.';


    SEO.set(metaTag, titleTag);  

    //Initialize all default values for view
    vm.calculating = false;

    //Default View Settings for result view
    vm.cashFlowView = 'graph';
    vm.cashOnEquityView = 'graph';
    vm.totalReturnView = 'graph';
    
    vm.calculate = function (form){
      if(form.$valid)  {
        //Get the data for the tables, graphs etc.
        var results = RentalCalculator.calculateResults(vm.input);

        //Whenever we calculate new tables, I am resetting the tabs to show graph first
        //the reason why I added this is because the sizing gets messed up when they are hidden as they get drawn
        vm.cashFlowView = 'graph';
        vm.cashOnEquityView = 'graph';
        vm.totalReturnView = 'graph';

        //A watch has been added in the mp-charts directive that triggers drawing of the graphs
        vm.chartData = results;

      } else {
        //Generate list of missing fields
        vm.missingFields = [];

        for(var i = 0; i < form.$error.required.length; i++){
            vm.userWantedToViewResults = true;
            vm.missingFields.push(form.$error.required[i].$name);
        }
      }
    };

    vm.calculateDownPayments = function(triggerIndicator){
      RentalCalculator.calculateDownPayments(triggerIndicator, vm.input);
    };

    vm.calculateFieldExpenses = function(triggerIndicator){
      RentalCalculator.calculateFieldExpenses(triggerIndicator, vm.input);
    };

    /* 
     * Setting up defaults values for the rows 
     *  when the curly braces are added the track by $index knows to add one income form
     *  When no curly braces the form will not displayed until user adds it
     */
    vm.input.units = [{}];
    vm.input.supplementalIncomes = [{}];
    vm.input.specialTermsLoans = [{stl_interestOption: "no"}];
    vm.input.capitalExpenditures = [{}];
    vm.input.capitalExpenditures[0].ce_date = getCurrentDate();
    vm.input.capitalExpenditures[0].ce_description = "Rehab";
    vm.input.loans = [];
    vm.input.utilities = [];
    vm.input.expenses = [];
    vm.input.loanInfoView = 'bankLoan';
    vm.input.bp_assumedAppreciation = 3;
    vm.input.ri_annualRentIncrease = 3;
    vm.input.e_annualExpenseIncrease = 3;
    vm.input.m_costPercent = 10;
    vm.input.li_purchaseDate = getCurrentDate();
    vm.input.o_vacancyRate = 5;


    //To follow are all add or delete functions
    //I need to look into make them reusable here!!
    vm.addUnit = function() {
      vm.input.units.push({});
    };
    vm.removeUnit = function() {
        var lastItem = vm.input.units.length-1;
        vm.input.units.splice(lastItem);
    };

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
      vm.input.capitalExpenditures.push({ce_date: getCurrentDate(), ce_description: "Rehab"});
    };
    vm.removeCapitalExpenditure = function() {
      var lastItem = vm.input.capitalExpenditures.length-1;
      vm.input.capitalExpenditures.splice(lastItem);
    };

    //Tooltips Text
    vm.amortizationText = "How many years is your loan for?"
                          + "Residential loans are typically 30 or 15 years. "
                          + "Commercial loans are typically 20 or 25 years.";

    vm.preparedForText = "If you’re a real estate agent planning on sharing this "
                          + "report with a client or an investor preparing this "
                          + "for a partner or lender, this is where you put the "
                          + "name of who you are generating this report for.";

    vm.extraPrincipalText = "Are you planning to pay additional money every month towards your loan? "
                            + "The “Start” and “End” fields allow you to enter a "
                            + "specified time frame that you plan on making extra payments per month.";

    vm.balloonDateText = "Some loans, like hard money loans";

    vm.lenderPointsText = "Many hard money lenders and private lenders will charge "
                          + "you fees immediately when you take the loan in addition "
                          + "to interest over the life of the loan. The term “points” "
                          + "is used, and one point equals 1% of the loan value. Using "
                          + "a $100k loan as an example, if a hard money lender charges "
                          + "2 points up front and 10% interest, you would owe the lender "
                          + "$2,000 up front.";
    vm.rentIncreaseText = "Rents typically go up over time. 3% is the national average.";
    vm.expenseIncreaseText = "Expenses go up over time. 3% is a good average.";                      

    vm.maitenanceText = "Things need to be replaced, repaired, and upgraded over "
                        + "time. Typically, 10% of gross rents, 15% of gross rents for older "
                        + "properties that require more upkeep.";
    vm.vacancyText = "As tenants move out and new tenants move in, you will most likely "
                      + "experience periods of time where you are unable to collect any "
                      + "rental income. A commonly used vacancy rate is 5%";
    vm.propTaxText = "What are the property taxes for an entire year? If you don’t "
                      + "know, this information is almost always available on your "
                      + "county assessor’s website, or websites like Zillow or Redfin.";

    vm.capRateText = "The Cap rate (capitalization rate) is a financial measure used "
                      + "to compare two or more commercial or multifamily properties. "
                      + "The cap rate is one measure that allows us to compare two "
                      + "unlike properties, like a 4 plex vs a 10 unit apartment "
                      + "building for example. Cap rate is not a number that conveys "
                      + "how much profit the investor is actually making, and most "
                      + "experienced investors care far more about their cash on cash "
                      + "return %.";
    vm.appreciationText = "Property values go up over time. That’s one of the reasons "
                          + "we invest in real estate! Put the average annual assumed "
                          + "appreciation of your property here. A good average is 3%-3.5%.";

    vm.desiredCashText = "Cash on cash return is the amount of dollars your property "
                          + "generates that you actually get to spend every month, "
                          + "expressed as a percentage based on the amount of dollars "
                          + "you’ve had to put into the property. For example, if you "
                          + "have to put $100k (not a loan, actual dollars from your "
                          + "bank account) into a property for down payment, closing "
                          + "costs, repairs, etc and the property generates $1,000 each "
                          + "month after all expenses, mortgage, taxes, and everything "
                          + "else, your cash on cash return would be 12% [($1k/month*12 "
                          + "months)/$100,000] If you don’t know what to shoot for, 10% "
                          + "is a good starting point, but this can vary wildly depending "
                          + "on area.";

    vm.tenantPlacementText = "In addition to a percentage of gross monthly rent, "
                              + "property managers often charge a one time fee for "
                              + "every time they place a new tenant in your property. "
                              + "This is expressed in a dollar value, and is frequently "
                              + "close to one month’s worth of rent for the unit they "
                              + "rent out. Because we don’t always know when tenants will "
                              + "move in and out, the dollar value you enter here will be "
                              + "turned into a fixed monthly cost based on your vacancy rate "
                              + "% when displayed in the results.";

    vm.managementFeeText = "How much does your property manager charge each month to "
                            + "manage the property? This number is typically expressed "
                            + "as a percentage of gross monthly rents. Rates vary by "
                            + "location, property time, and management company, but a "
                            + "good range is typically between 7%-12%.";

    vm.capitalExpendituresText = "Property improvements outside of regular maitenance.";

    vm.arvText = "The price you pay for a property isn't always the same as what it's actually " 
              + "worth. In this field, enter what you believe the property is actually worth. "
              + "If you are rehabbing, enter what you believe the property is worth after your "
              + "repairs.";
});

App.controller('FileController', ['$scope', function ($scope){
	 $scope.imageFileName = '';
	 $scope.imgUpload = {};
	 $scope.imgUpload.src = '';
}]);

function getCurrentDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    var result = mm+'/'+ dd +'/'+ yyyy;
    return result;
}
