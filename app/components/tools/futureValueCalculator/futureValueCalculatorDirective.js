/*  Takes in the data from the calculation in the controller and draws charts, tables, pie charts etc.
 *  This is using google charts */
 App.directive('mpFutureValueCharts', function($timeout) {
  return {
    restrict: 'E',  /*only matches directive with element name*/
    scope: {
      data: '=data',
      futureValuePieChartLabels: '=futureValuePieChartLabels',
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
                createStackedColumnChart();
                createPieChart();
                createGauge();
            }
          }
        }, true); //deep object equlity checking
      }

      function createGauge() {
        var gaugeElement = $("#futureValueGauge")[0],
            rawData = scope.data.futureValueGauge;


        var chart = new google.visualization.Gauge(gaugeElement);

        /*To ensure that the table data gets updated*/
        $timeout(function() {
          chart.draw(rawData.data, rawData.options);
        });
      }

      function createPieChart(){
        var chartElement = $("#futureValuePieChart")[0],
            rawData = scope.data.futureValuePieChart;

        //Intialize chart
        var incomePieChart = new google.visualization.PieChart(chartElement);

        //Create data table for chart
        var data = google.visualization.arrayToDataTable(rawData.data);

        //Set up the custom pie chart labels
        scope.futureValuePieChartLabels = rawData.labels;

        /*To ensure that the table data gets updated*/
        $timeout(function() {
          incomePieChart.draw(data, rawData.options);
        });
      }

      function createStackedColumnChart() {
        var chartElement = $("#futureValueStackColumnChart")[0],
            rawData = scope.data.futureValueChart;

        //Initialize chart
        //var chart = new google.visualization.ColumnChart(chartElement);
        var chart = new google.visualization.ColumnChart(chartElement);

        //Create data table for chart   
        var data = google.visualization.arrayToDataTable(rawData.data);

        /*To ensure that the table data gets updated*/
        $timeout(function () {
          //Draw Chart
          chart.draw(data, rawData.options);
        });
      }
    }
  }
});