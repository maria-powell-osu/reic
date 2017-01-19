App.factory('FutureValueCalculator', function() {
	var FutureValueCalculator = {};
	return {
		calculateResults: function (userInput){
			return futureValueCalculations(userInput);
		}

	}
});

function futureValueCalculations(userInput){
	var result = {};
	result.dataForVisuals = {};

	if (userInputValid(userInput)){
		var p = userInput.investAmount,
			r = (userInput.annualRateOfReturn / 100) / 12,
			n = userInput.years * 12,
			a = userInput.monthlyContributions,
			w = n - (userInput.yearsBeforeContributing * 12);

		//Calculate future value of investment	
		result.futureValue = Math.round(calculateLumpSum(p,r,n) + calculateMonthlyPayments(a,r,n));

		//Calculate total Amount contributed
		result.totalAmountContributed = Math.round(calculateTotalAmountContributed(p, a, n));

		//Calculate total investment return
		result.totalInvestmentReturn = Math.round(calculateTotalInvestmentReturn(result.futureValue, result.totalAmountContributed));

		//Calculate future value of waited xx years
		result.futureValueOfYears = Math.round(calculateFutureValueLumpSum(p, r, w) + calculateFutureValueAnnuity(a, r, w));

		result.resultPercent = Math.round(calculatePercent(result.totalInvestmentReturn, result.totalAmountContributed));

		//Calculate cost of waiting
		result.costOfWaiting = Math.round(calculateCostOfWaiting(result.futureValue, result.futureValueOfYears));

		//Data for future value stacked column chart
		result.dataForVisuals.futureValueChart = createFutureValueChartData(p, r, userInput.years, a);

		//data for future value pie chart
		result.dataForVisuals.futureValuePieChart = createFutureValuePieChartData(result.totalInvestmentReturn, result.totalAmountContributed);
	

		//data for future value return gauge
		//result.dataForVisuals.futureValueGauge = createFutureValueGauge(result.resultPercent);
	} else {
		result = 0;
	}

	return result;
}


function createFutureValueGauge(returnPercent){
	var result = {};

	result.data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['Return %', returnPercent]
        ]);

	var gaugeMax = returnPercent > 100 ? returnPercent : 100; 

    result.options = {
          width: 400, height: 120,
          greenFrom: 50, greenTo: gaugeMax,
          redFrom: 0, redTo: 20,
          yellowFrom:20, yellowTo: 50,
          minorTicks: 5
        };

	return result;
}

function createFutureValuePieChartData(totalInvestmentReturn, totalAmountContributed){
	var result = {},
		dataArray = [],
		colorArray = [	
			'#004080',
			'#cccc00',
			'#990000',
			'#660066',
			'#00004d',
			'#008000',
			'#999966',
			'#1f1f14',
			'#00cccc',
			'#ff80ff',
			'#cc6666',
			'#ff6600'
		];

	//add columns to the data 
	dataArray.push(["Description", "Amount"]);

	//Add Data 
	dataArray.push(["Interest Earned", totalInvestmentReturn]);
	dataArray.push(["Total Contributed", totalAmountContributed]);

	result.data = dataArray;
  
  	//When we create labels without including the header descriptions
    var dataArrayWithoutHeader = dataArray.slice(); //slice returns a new array so that we are not altering the old array
    dataArrayWithoutHeader.shift();

    //Since we do not like the google charts legend label display, let's make our own 
  	result.labels = createLabelArray(colorArray, dataArrayWithoutHeader);

  	//Set up display preferences
  	result.options = {
	    is3D: true,
	    legend: "none",
	    fontSize: 11,
	    chartArea:{left:20,top:0,width:'50%',height:'75%'},
	    pieSliceText: 'none',
	    colors: colorArray
  	};

  	return result;
}

function createFutureValueChartData(p, r, years, a){
	var result = {},
		chartData = [],
		colorArray = [	
			'#cccc00',
			'#004080',
			'#990000',
			'#660066',
			'#00004d',
			'#008000',
			'#999966',
			'#1f1f14',
			'#00cccc',
			'#ff80ff',
			'#cc6666',
			'#ff6600'
		];

	result.options = {
		legend: {position: 'top', maxLines:3},
		bar: {groupWidth: '75%'},
		isStacked: true,
		colors: colorArray,
	};

	//Create the data in array format
	var rawDataArray = [];
	if(p == 0 && r == 0 && years == 0 && a == 0){
		rawDataArray = [0, 1, 0];
	}else{
		rawDataArray = createFutureValueGraphData(p, r, years, a);
	}

	//Add columns to the data 
	chartData.push(["Year", "Amount Contributed", "Interest Earned"]);

	//Add data rows to the data
	rawDataArray.forEach(function(row) {
		chartData.push(row);
	});

	result.data = chartData;

	return result;
}

function createFutureValueGraphData(p, r, years, a){
	var result = [];

	//because in finances we start counting at 1
	for(var i = 1; i < years + 1; i++){
		var dataRow = [],
			n = i * 12;

		//Years Column
		dataRow.push(i);

		//Amount Contributed Column
		var totalAmountContributed = Math.round(calculateTotalAmountContributed(p, a, n));
		dataRow.push(totalAmountContributed);

		//Interest Earned Column
		var futureValue = Math.round(calculateLumpSum(p,r,n) + calculateMonthlyPayments(a,r,n));
		var interestEarned = Math.round(calculateTotalInvestmentReturn(futureValue, totalAmountContributed));
		dataRow.push(interestEarned);

		result.push(dataRow);
	}

	return result;
}

function calculatePercent (totalInvestmentReturn, totalAmountContributed){
	var result;

	if(totalInvestmentReturn !== null && totalAmountContributed !== null){
		result = (totalInvestmentReturn / totalAmountContributed) * 100;
	}else{
		result = 0;
	}

	return result;
}

function calculateCostOfWaiting(futureValue, futureValueOfYears) {
	var result;

	if(futureValue != null && futureValueOfYears != null){
		result = futureValue - futureValueOfYears;
	}else {
		result = 0;
	}

	return result;
}

function calculateTotalInvestmentReturn(futureValue, totalAmountContributed) {
	var result;

	if(futureValue != null && totalAmountContributed != null){
		result = futureValue - totalAmountContributed;
	}else {
		result = 0;
	}

	return result;
}

function calculateTotalAmountContributed(p, a, n){
	var result;

	if (a == null){
		a = 0;
	}

	if (n == null){
		n = 0;
	}

	if(p != null && a != null && n != null){
		result = p + (a * n);
	} else {
		result = 0;
	}

	return result;
}

function calculateFutureValueLumpSum(p, r, w){
	var result;

	if(p != null && r != null && w != null){
		result = p * Math.pow( (1 + r), w);
	}

	return result;
}

function calculateFutureValueAnnuity(a, r, w){
	var result;

	if(a != null && r != null && w != null){
		var subResult = Math.pow( (1 + r), w) - 1;
		result = a * (subResult / r);
	}

	return result;
}

function calculateLumpSum(p,r,n) {
	var result;	

	if (p != null && r != null && n != null){
		result = p * Math.pow((1 + r), n);
	} else {
		result = 0;
	}

	return result;
}

function calculateMonthlyPayments(a,r,n){
	var result;

	if (a != null && r != null && n != null){
		var subResult = (Math.pow( (1 + r), n) - 1) / r;
		result = a * subResult;
	} else {
		return 0;
	}

	return result;
}

function userInputValid(userInput) {
	var result = true;
		
	//if userInput is not defined then the input is not valid
	if (userInput){

		//if the values are not set, then default them to 0
		var investAmount = userInput.investAmount ? userInput.investAmount : 0,
			monthlyContributions = userInput.monthlyContributions ? userInput.monthlyContributions : 0,
			annualRateOfReturn = userInput.annualRateOfReturn ? userInput.annualRateOfReturn : 0,
			yearsBeforeContributing = userInput.yearsBeforeContributing ? userInput.yearsBeforeContributing : 0,
			years = userInput.years ? userInput.years : 0;

		//Check that the following values are all ints or floats
		if(investAmount !== parseInt(investAmount, 10)){
			result = false;
		}else if(monthlyContributions !== parseInt(monthlyContributions, 10)){
			result = false;
		}else if (years !== parseInt(years, 10)){
			result = false;
		}else if(annualRateOfReturn !== parseFloat(annualRateOfReturn)){
			result = false;
		}else if (yearsBeforeContributing !== parseFloat(yearsBeforeContributing)){
			result = false;
		}
	} else {
		result = false;
	}

	return result;
}

/*
 * Description: Helper function to create labels for pie charts
 *                This was create because default goog chart labels suck
 * Params:      Colors: colors used in the pie chart so I can add color coding)
 *              Data: the sections added into the pie charts
 */
function createLabelArray (colors, data){
	var result = [],
  		errormsg,
  		descIndex = 0,
  		valueIndex = 1,
  		i = 0;

	//Create the label array with colors in it
	for (i; i < data.length; i++){ 
		//check data format
		if(typeof(data[i][descIndex]) == 'undefined' 
			|| typeof(data[i][valueIndex]) == 'undefined'){
			//TODO: throw error
		}else {
			var description = data[i][descIndex],
			value = data[i][valueIndex],
			colorIndex = 0,
			temp;

	    	//when we have more data sections then colors
	    	//we start to reloop the colors
	    	if(colors.length >= i) {
	      		colorIndex = i;
	    	} else {
	      		colorIndex = i - (colors.length - 1);
	    	}

	    	result.push({description:description, value:value, color:colors[colorIndex]});
	  	}
	}
	return result;
}