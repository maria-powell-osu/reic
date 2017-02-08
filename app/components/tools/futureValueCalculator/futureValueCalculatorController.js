App.controller("FutureValueCalculatorController", function($scope, FutureValueCalculator, SEO) {
	var vm = this;
	vm.input = {};
	vm.result = {};

	var titleTag = "Investment Return Calculator | Plan Passive";
    var metaTag = 'Find out how much money will you have in your 401k? How long will it take you to become a millionaire? Cost you of waiting a few more years to invest?';
    SEO.set(metaTag, titleTag);  

	//Default Values
	vm.view = "barGraph";
	vm.result.futureValue = 0;
	vm.result.totalAmountContributed = 0;
	vm.result.totalInvestmentReturn = 0;
	vm.result.futureValueOfYears = 0;
	vm.result.costOfWaiting = 0;

	vm.calculate = function (){
		var result = FutureValueCalculator.calculateResults(vm.input);

		if (result){
			vm.result.futureValue = result.futureValue;
			vm.result.totalAmountContributed = result.totalAmountContributed;
			vm.result.totalInvestmentReturn = result.totalInvestmentReturn;
			vm.result.futureValueOfYears = result.futureValueOfYears;
			vm.result.costOfWaiting = result.costOfWaiting;
			vm.result.resultPercent = result.resultPercent;

			 //Whenever we calculate new tables, I am resetting the tabs to show graph first
        	//the reason why I added this is because the sizing gets messed up when they are hidden as they get drawn
			vm.view = "barGraph";

			//A watch has been added in the mp-charts directive that triggers drawing of the graphs
        	vm.chartData = result.dataForVisuals;
		}
	}

});