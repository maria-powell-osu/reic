/* Basic Property Information
 * Loads template into rentalCalculatorInput.html
 */
/* App.directive('basicPropertyInformation', function() {
  return {
    templateUrl: '/app/components/tools/rentalCalculator/sectionViews/basicPropertyInformation.html'
  };
});*/

/* Basic Property Information
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('overTime', function() {
  return {
    templateUrl: '/app/components/tools/rentalCalculator/sectionViews/overTime.html'
  };
});

/* Loan Information
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('loanInformation', function() {
  return {
    templateUrl: '/app/components/tools/rentalCalculator/sectionViews/loanInformation.html'
  };
});


/* Income Sources
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('incomeSources', function() {
  return {
    templateUrl: '/app/components/tools/rentalCalculator/sectionViews/incomeSources.html'
  };
});

/* Expenses
 * Loads template into rentalCalculatorInput.html
 */
 App.directive('expenses', function() {
  return {
    templateUrl: '/app/components/tools/rentalCalculator/sectionViews/expenses.html'
  };
});

 /* Results
 * Loads template into result.html
 */
 App.directive('results', function() {
  return {
    templateUrl: '/app/components/tools/rentalCalculator/sectionViews/results.html'
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
              createCashOnEquityTable();
              createCashOnEquityChart();
              createTotalReturnTable();
              createTotalReturnStackedBarChart();

              //Stop the page loader
              setTimeout(function(){ 
                 scope.calculating = false;
                 scope.$apply();
               }, 1000);

             
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

      function createCashOnEquityChart(){
        var chartElement = $("#cashOnEquityChart")[0],
            rawData = scope.data.cashOnEquityChart;

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

      function createTotalReturnStackedBarChart(){
        var chartElement = $("#totalReturnStackedBarChart")[0],
            rawData = scope.data.totalReturnStackedBarChart;

        //Initialize chart
        //var chart = new google.visualization.ColumnChart(chartElement);
        var chart = new google.visualization.ComboChart(chartElement);

        //Create data table for chart   
        var data = google.visualization.arrayToDataTable(rawData.data);

        /*To ensure that the table data gets updated*/
        $timeout(function () {
          //Draw Chart
          chart.draw(data, rawData.options);
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

      function createCashOnEquityTable() {
        var table,
            data = new google.visualization.DataTable(),
            tableElement = $("#cashOnEquityTable")[0],
            rawData = scope.data.cashOnEquityTable;

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

      function createTotalReturnTable (){
        var table,
            data = new google.visualization.DataTable(),
            tableElement = $("#totalReturnTable")[0],
            rawData = scope.data.totalReturnTable;

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

