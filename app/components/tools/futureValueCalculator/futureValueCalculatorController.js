App.controller("FutureValueCalculatorController", function($scope, FutureValueCalculator) {
	var vm = this;
	vm.input = {};
	vm.result = {};

	//Default Values
	vm.view = "barGraph";
	vm.result.futureValue = 0;
	vm.result.totalAmountContributed = 0;
	vm.result.totalInvestmentReturn = 0;
	vm.result.futureValueOfYears = 0;
	vm.result.costOfWaiting = 0;
	/*vm.chartData = FutureValueCalculator.defaultEmptyGraphs();*/

	vm.calculate = function (){
		var result = FutureValueCalculator.calculateResults(vm.input);

		if (result){
			vm.result.futureValue = result.futureValue;
			vm.result.totalAmountContributed = result.totalAmountContributed;
			vm.result.totalInvestmentReturn = result.totalInvestmentReturn;
			vm.result.futureValueOfYears = result.futureValueOfYears;
			vm.result.costOfWaiting = result.costOfWaiting;

			//A watch has been added in the mp-charts directive that triggers drawing of the graphs
        	vm.chartData = result.dataForVisuals;
		}
	}

});