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

 /* Results
 * Loads template into result.html
 */
 App.directive('results', function() {
  return {
    templateUrl: '/reic/app/components/tools/rentalCalculator/sectionViews/results.html'
  };
});

/*
 * Activates Tooltip for element
 */
App.directive("mpTooltip", function($timeout) {
   return {
      restrict: 'A', //only want it triggered for attributes
      link: function(scope, element, attrs, ctrl) {
         $(element).attr('title', attrs.mpTooltip).tooltip();
      }
   };
});

/*
 * Sets up the asterix on required fields
 * Required the input to have a label before it
 */
App.directive("mpRequired", function($timeout) {
   return {
      require: 'ngModel',
      restrict: 'A', //only want it triggered for attributes
      link: function(scope, element, attrs, ctrl) {
        
        //If the req. field has a label, prepend asterix to label
        if($(element[0].previousElementSibling).is('label')){
          $(element[0].previousElementSibling).prepend("<b class='text-danger'>* </b>");
        }
      }
   };
});



/*  Takes in the data from the calculation in the controller and draws charts, tables, pie charts etc.
 *  This is using google charts */
 App.directive('mpCharts', function($timeout) {
  return {
    restrict: 'E',  /*only matches directive with element name*/
    scope: {
      data: '=data',
      calculating: '=calculating',
      incomePieChartLabels: '=incomePieChartLabels',
      expensePieChartLabels: '=expensePieChartLabels',
    },
    link: function (scope, element, attrs, ctrl) {

      //Added to ensure that google loads library fully before drawing charts
      google.charts.setOnLoadCallback(processTable);

      //Callback function
      function processTable(){

        //Watches, to refresh the chart when data object changes
        scope.$watch('data', function (newValue, oldValue) {
          /*
           * https://docs.angularjs.org/api/ng/type/$rootScope.Scope
           * If these two values are identical (===) then the listener was called due to initialization.
           */
          if (newValue !== oldValue) {

            //For Error Handling
            if(scope.data){

              //Start the Loader so this calculation will not get interrupted
              scope.calculating = true;      
               
              //Create all the charts, tables, etc.
              createCashFlowTable();
              createCashFlowChart();
              createIncomePieChart();
              createExpensePieChart();

              //Stop the page loader
              scope.calculating = false;
            }
          }
        }, true); //deep object equlity checking
      }

      function createExpensePieChart() {
        var chartElement = $('#expensePieChart')[0],
            rawData = scope.data.expensePieChart;

        //Initialize Chart
        var expensePieChart = new google.visualization.PieChart(chartElement);

        //Create data table for chart
        var data = google.visualization.arrayToDataTable(rawData.data);

        //Set up the custom pie chart labels
        scope.expensePieChartLabels = rawData.labels;

        //to ensure that the data gets updated properly
        $timeout(function() {
          //draw table
          expensePieChart.draw(data, rawData.options);
        });
      }

      function createIncomePieChart() {
        var chartElement = $("#incomePieChart")[0],
            rawData = scope.data.incomePieChart;

        //Intialize chart
        var incomePieChart = new google.visualization.PieChart(chartElement);

        //Create data table for chart
        var data = google.visualization.arrayToDataTable(rawData.data);

        //Set up the custom pie chart labels
        scope.incomePieChartLabels = rawData.labels;

        /*To ensure that the table data gets updated*/
        $timeout(function() {
          incomePieChart.draw(data, rawData.options);
        });
      }

      function createCashFlowChart() {
        var chartElement = $("#cashFlowProjectionChart")[0],
            rawData = scope.data.cashFlowProjectionChart;
        
        //Initialize chart
        var chart = new google.visualization.ComboChart(chartElement);

        //Create data table for chart   
        var data = google.visualization.arrayToDataTable(rawData.data);

        /*To ensure that the table data gets updated*/
        $timeout(function () {
          //Draw Chart
          chart.draw(data, rawData.options);
        });
      }

      function createCashFlowTable (){
        var table,
            data = new google.visualization.DataTable(),
            tableElement = $("#cashFlowProjectionTable")[0],
            rawData = scope.data.cashFlowProjectionTable;

        //Add Table Columns
        (rawData.columns).forEach(function(column) {
          data.addColumn('number', column);
        });

        //Add Table Rows
        data.addRows(rawData.rows);

        //Initialize Table
        table = new google.visualization.Table(tableElement);

        /*To ensure that the table data gets updated*/
        $timeout(function () {
          table.draw(data, rawData.options);
        });
      }
    }
  };
});

/* App.directive('mpCashFlowProjectionTable', function($timeout) {
  return {
    restrict: 'E', 
    scope: {
      data: '=data',
      calculating: '=calculating',
    },
    link: function (scope, element, attrs, ctrl) {

      //Added to ensure that google loads charts fully before drawing charts
      google.charts.setOnLoadCallback(processTable);

      //Callback function
      function processTable(){
        
        //Watches, to refresh the chart when data object changes
        scope.$watch('data', function (newValue, oldValue) {
          
          if (newValue !== oldValue) {
            var table,
              data = new google.visualization.DataTable(),
              tableElement = element[0];

            //For Error Handling
            if(scope.data){
              scope.calculating = true;      
     
              //Add Table Columns
              (scope.data.columns).forEach(function(column) {
                data.addColumn('number', column);
              });

              //Add Table Rows
              data.addRows(scope.data.rows);

              //Create Table
              table = new google.visualization.Table(tableElement);

              $timeout(function () {
                table.draw(data, scope.options);
              });

              scope.calculating = false;
            }
          }
        });
      }
    }
  };
});*/

