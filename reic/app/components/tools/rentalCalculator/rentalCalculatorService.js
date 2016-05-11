App.factory('RentalCalculator', function() {
	var RentalCalculator = {};
	return {
		/*getData: function(){
			return RentalCalculator;
		},
		setData: function (rentalCalculatorData){
			RentalCalculator = rentalCalculatorData;
		},*/
		nextStep: function (currStep, lastStep) {
			return currStep < lastStep ? currStep + 1 : currStep;
		},
		prevStep: function (currStep) {
			return (currStep !== 0) ? currStep - 1 : currStep;
		},
		jumpTo: function (jumpToIndex){
			return jumpToIndex;
		},
		calculate: function (userInput){
			return rentalCalculations(userInput);
		}
	}
});

function validatePropertyInfo(userInput){
	var result = false;

	return result;
}

function rentalCalculations(form) {     
    var result = {};

    result.cashFlowProjectionTable = createTable(form);
    result.cashFlowProjectionChart = createCashFlowProjectionComboChart(form);
    result.incomePieChart = createIncomePieChart(form);
    result.expensePieChart = createExpensePieChart(form);

	return result;
}

function createTable(form) {
	var tableData = {};
	
	//Create Columns
	tableData.columns = ["Year", "Income", "Expenses", "CAPEX ", "Loan PMT", "Cash Flow", "Cash on Cash"];

  	//Create Rows
  	tableData.rows = createDataRows(tableData.columns, form);

  	//Table display options
    tableData.options = {width: '100%', height: '300px'};

    return tableData;
}

function createCashFlowProjectionComboChart(form) {
	var	rawDataArray = form.cashFlowTableData,
		cashFlow = 5,
		year = 0,
		cashOnCash = 6,
		chartData = [],
		result = {};

	//Specify axis information
	result.options = {
		series: {
			0: {axis: 'CashFlow', type: 'bars'}, 
			1: {axis: 'CashOnCash', type: 'line', targetAxisIndex:1}
		},
		axes: {
			y: {
				CashFlow: {label: 'Cash Flow ($)'},
				CashOnCash: {label: 'Cash on Cash (%)'}
			}
		},
		hAxis: {title: 'Years'},
		width: '100%', 
		height: '100%'
	};

	//Add columns to the data 
	chartData.push(["Year", "Cash Flow ($)", "Cash on Cash (%)"]);

	//Add data rows to the data
	rawDataArray.forEach(function(row) {
		var dataRow = [];
		dataRow.push(row[year]);
		dataRow.push(row[cashFlow]);
		dataRow.push(row[cashOnCash]);
		chartData.push(dataRow);
	});

	result.data = chartData;

	return result;
}


function createIncomePieChart(form){
	var	result = {},
		dataArray = [],
		units = form.units || [],
		unitsLength = Object.keys(units).length,
		supplementalIncomes = form.supplementalIncomes || [],
		supplementalIncomesLength = Object.keys(supplementalIncomes).length,
		sumOfGrossMonthlyUnitIncome = 0,
		colorArray = [
			'#008000',
			'#004080',
			'#990000',
			'#660066',
			'#00004d',
			'#cccc00',
			'#999966',
			'#1f1f14',
			'#00cccc',
			'#ff80ff',
			'#cc6666',
			'#ff6600'
		];

	//add columns to the data 
	dataArray.push(["Description", "IncomeAmount"]);

	//add unit income
	for (var i = 0; i < unitsLength; i++) {
		sumOfGrossMonthlyUnitIncome += units[i].ri_grossMonthlyIncome;
	}
	dataArray.push(["Rental Income", sumOfGrossMonthlyUnitIncome]);              

	//add new row for each supplemental income
	for (var i = 0; i < supplementalIncomesLength; i++) {
		var description = supplementalIncomes[i].si_description,
			value = supplementalIncomes[i].si_grossMonthlyIncome;
		dataArray.push([description, value]);
	}

  	result.data = dataArray;
  
  	//Since we do not like the google charts legend label display, let's make our own 
  	result.labels = createLabelArray(colorArray, dataArray, headerDescriptionIsSet = true);

  	//Set up display preferences
  	result.options = {
	    width: '100%', 
	    height: '100%',
	    is3D: true,
	    legend: "none",
	    fontSize: 11,
	    pieSliceText: 'none',
	    colors: colorArray
  	};

	return result;
}

function createExpensePieChart(form){
	var	result = {},  
		dataArray = [],
		monthlyExpenses = 0,
		yearlyExpenses = 0,
		expenseResult = 0,
		addedUtilities = form.utilities || [],
		addedUtilitiesLength = Object.keys(addedUtilities).length,
		colorArray = [
			  '#008000',
			  '#004080',
			  '#990000',
			  '#660066',
			  '#00004d',
			  '#cccc00',
			  '#999966',
			  '#1f1f14',
			  '#00cccc',
			  '#ff80ff',
			  '#cc6666',
			  '#ff6600'
		];

    //add columns to the data 
    dataArray.push(["Description", "ExpenseAmount"]);

    if (form.u_water){
    	dataArray.push(["Water", form.u_water]);
    }
    if (form.u_sewer){
    	dataArray.push(["Sewer", form.u_sewer]);
    }
    if (form.u_garbage){
        dataArray.push(["Garbage", form.u_garbage]);
    }
    if (form.u_electricity){
        dataArray.push(["Electricity", form.u_electricity]);
    }
    if (form.u_naturalGas){
        dataArray.push(["Natural Gas", form.u_naturalGas]);
    }
    if (form.u_internet){
        dataArray.push(["Internet", form.u_internet]);
    }
    if (form.m_costAmount){
        dataArray.push(["Cost Amount", form.m_costAmount]);
    }
    if (form.o_yardMaintenance){
        dataArray.push(["Yard Maintenance", form.o_yardMaintenance]);
    }
    if (form.o_insurance){
        dataArray.push(["Insurance", form.o_insurance]);
    }
    if (form.pm_managementFeeAmount || (form.pm_tenantPlacementFee && form.o_vacancyRate)){
        var tenantFee = form.pm_tenantPlacementFee || 0,
        vacancyRate = form.o_vacancyRate || 0,
        monthlyTenantFee = tenantFee * vacancyRate,
        managementFee = form.pm_managementFeeAmount + monthlyTenantFee;
        
        dataArray.push(["Property Management", managementFee]);
    }
    if (form.o_propertyTaxes){
        var propTaxes = form.o_propertyTaxes / 12;
        dataArray.push(["Property Taxes", propTaxes]);
    }
    if (form.o_vacancyRate){
        var vacancyRate = form.o_vacancyRate / 100,
            //we are dividing by 12 because the function return income per year
            income = Math.round(calculateFirstYearIncome(form) /12),
            vacancyPerMonth = income * vacancyRate;
            dataArray.push(["Vacancy", vacancyPerMonth]);
    }

    //add up all monthly custom utility costs added by User
    for (var i = 0; i < addedUtilitiesLength; i++) {
        dataArray.push([addedUtilities[i].add_u_name, addedUtilities[i].add_u_amount]);
    }
    result.data = dataArray;

	//Since google charts legend label display sucks I am creating our own 
	result.labels = createLabelArray(colorArray, dataArray, headerDescriptionIsSet = true);

	result.options = {
		width: '100%', 
		height: '100%',
		is3D: true,
		legend: "none",
		pieSliceText: 'none',
		colors: colorArray
	};

	return result;
}

/*
 * Description: Helper function to create labels for pie charts
 *                This was create because default goog chart labels suck
 * Params:      Colors: colors used in the pie chart so I can add color coding)
 *              Data: the sections added into the pie charts
 *              headerDescription: e.g. for the pie charts we set up the array to contain description
 *                                 of the data in the first position of the array and we would not want
 *                                 this for our labels so we need to take it out if flag is true       
 */
function createLabelArray (colors, data, headerDescriptionIsSet){
	var result = [],
  		errormsg,
  		descIndex = 0,
  		valueIndex = 1,
  		i = 0;

    //if the data array contains description header
    //then take out the first row which is the header
    if(headerDescriptionIsSet){
        i = 1;
    }

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

/*
* Helper Function:
* Creates the data that goes into each columns
*/
function createDataRows (columns, form) {
	var dataRows = [],
		years = getYears(form),
		capitalExpenditures = calculateCapitalExpenditures(years, form),
		capExSumUpUntilNow = 0,
		loanPmts = calculateLoanPmts(years, form),
		incomeColumn = 1,
		expenseColumn = 2,
		balloonPmtsCashFlow = balloonPmtCashFlow(years, form),
		lenderPointsSum = sumOfSpecialTermsLenderPoints(form),
		loanSum = sumOfSpecialTermsLoanAmounts(form.loanInfoView, form);


	for (var i = 0; i < years; i++) {
		var column = [],
			incomeData,
			cashFlowData,
			cashOnCashData,
			expenseData;

		yearData = i + 1;
		incomeData = calculateIncome(i, dataRows, incomeColumn, form);
		expenseData = calculateExpenses(i, dataRows, expenseColumn, incomeData, form);
		capExData = capitalExpenditures[i],
		loanPaymentData = loanPmts[i],
		cashFlowData = incomeData - expenseData - capExData - loanPaymentData;

		capExSumUpUntilNow += capExData;
		cashOnCashData = calculateCashOnCash(cashFlowData, capExSumUpUntilNow, lenderPointsSum, loanSum, balloonPmtsCashFlow[i], form);

		column.push(yearData);
		column.push(incomeData);
		column.push(expenseData);
		column.push(capExData);
		column.push(loanPaymentData)
		column.push(cashFlowData);
		column.push(cashOnCashData );
		dataRows.push(column);
	}

	form.cashFlowTableData = dataRows;
	return dataRows;
}

function calculateIncome (year, dataRows, incomeColumn, form) {
	var incomeResult,
		rentIncrease = form.ri_annualRentIncrease || 0;

	if (year == 0){
		incomeResult = calculateFirstYearIncome(form);
	} else {
		incomeResult = dataRows[year-1][incomeColumn] * ((rentIncrease/100) + 1);
	}
	return Math.round(incomeResult);
}

function calculateExpenses (year, dataRows, expenseColumn, incomeData, form){
	var expenseResult,
		expenseIncrease = form.e_annualExpenseIncrease || 0;

	if (year == 0){
		expenseResult = calculateFirstYearExpense(incomeData, form);
	} else {
		expenseResult = dataRows[year-1][expenseColumn] * ((expenseIncrease/100) + 1);
	}	
	return Math.round(expenseResult);
}

/*
 * Helper Function
 * Gets the amount of years for the data results
 * Years pretty much mean rows in the table
 * for special terms loans and bank loans the highest
 *  amortization get chosen
 */
function getYears(form){
	var years = 0,
		view = form.loanInfoView;

	if (view === "cash"){
		//aribitrarily set the years
		years = 30;
	} else if (view === "bankLoan"){
		var maxValue = form.bl_amortization || 0,
		addedBankLoans = form.loans || [],
		addedBankLoansLength = Object.keys(addedBankLoans).length;

		for (var i = 0; i < addedBankLoansLength; i++) {
			if (addedBankLoans[i].add_bl_amortization > maxValue) {
    			maxValue = addedBankLoans[i].add_bl_amortization;
  			}
		}
	
		years = maxValue + 1;
	} else if (view === "specialTermsLoan") {
		var maxValue = 0,
			specialTermsLoans = form.specialTermsLoans || [],
			specialTermsLoansLength = Object.keys(specialTermsLoans).length;

		for (var i = 0; i < specialTermsLoansLength; i++) {
  			var amortization = specialTermsLoans[i].stl_amortization || 0;
  			if (amortization > maxValue) {
    			maxValue = amortization;
  			}
		}
		years = maxValue + 1;
	}
	return years;
}

function calculateCashOnCash (cashFlowData, capExSumData, lenderPointsSum, loanSum, balloonPmt, form){
	var cashOnCashResult,
		view = form.loanInfoView,
		addedBankLoans = form.loans || [],
		closingCost = form.bl_closingCost || 0,
		dividend = cashFlowData,
		divisor,
		addedBankLoansLength = Object.keys(addedBankLoans).length;

	if (view === "cash"){
		divisor = capExSumData + form.li_purchasePrice;
	} else if (view === "bankLoan"){
		//If there is only one bankloan
		if (addedBankLoansLength == 0){
	  		divisor = capExSumData + form.bl_downPaymentDollar + closingCost + balloonPmt;
		} else {
	  		divisor = capExSumData + lenderPointsSum + form.bl_downPaymentDollar + closingCost + balloonPmt;
		}
	} else if (view === "specialTermsLoan"){
		divisor = capExSumData + lenderPointsSum + (form.li_purchasePrice - loanSum) + balloonPmt;
	}

	if (divisor <= 0){
		cashOnCashResult = 0;
	}else {
		//* 100 to display in percentage format                
		cashOnCashResult = (dividend / divisor) * 100;
	}
	return Math.round(cashOnCashResult);
}

/* Dont judge the naming convention here..terrible at naming things*/
function calculateNoInterestBalloonPayoff (loanAmount, interest, balloonYear, loanPayment, form){
	var ballonPayoffResult,
		interestPerMonth = (interest/100) / 12,
		temp = Math.pow(1 + interestPerMonth, balloonYear * 12),
		monthlyLoanPayment = loanPayment / 12;

	var valueOne = loanAmount * temp;
	var valueTwo = monthlyLoanPayment * ((temp - 1)/(interestPerMonth));

	ballonPayoffResult = valueOne - valueTwo;
	return ballonPayoffResult;
}

function sumOfSpecialTermsLenderPoints(form){
	var lenderPointsSumResult = 0,
		view = form.loanInfoView,                  
		addedBankLoans = form.loans || [],
		addedBankLoansLength = Object.keys(addedBankLoans).length,
		specialTermsLoans = form.specialTermsLoans || [],
		specialTermsLoansLength = Object.keys(specialTermsLoans).length;

	if(view === 'bankLoan'){
		for (var i = 0; i < addedBankLoansLength; i ++){
			lenderPointsSumResult += addedBankLoans[i].add_bl_upFrontLenderPoints || 0;
		}
	}else if(view === 'specialTermsLoan'){
		for (var i = 0; i < specialTermsLoansLength; i ++){
			lenderPointsSumResult += specialTermsLoans[i].stl_upFrontLenderPoints || 0;
		}
	}
	return Math.round(lenderPointsSumResult);
}

function sumOfSpecialTermsLoanAmounts(view, form){
	var specialTermsLoanAmountsResult = 0,
		addedBankLoans = form.loans || [],
		addedBankLoansLength = Object.keys(addedBankLoans).length,
		specialTermsLoans = form.specialTermsLoans || [],
		specialTermsLoansLength = Object.keys(specialTermsLoans).length;

	if (view == "bankLoan"){
		for (var i = 0; i < addedBankLoansLength; i ++){
			specialTermsLoanAmountsResult += addedBankLoans[i].add_bl_loanAmount;
		}
	}else if (view == "specialTermsLoan"){
		for (var i = 0; i < specialTermsLoansLength; i ++){
			specialTermsLoanAmountsResult += specialTermsLoans[i].stl_amount;
		}
	}
	return specialTermsLoanAmountsResult;
}

function amortizationCalculation (r, p, n) {
	var dividend = (r * (Math.pow((1 + r),n)));
	var divisor = ((Math.pow((1 + r), n)) - 1);

	return p * (dividend / divisor);
}

function balloonPmtCashFlow (years, form){
	var view = form.loanInfoView,
		addedBankLoans = form.loans || [],
		addedBankLoansLength = Object.keys(addedBankLoans).length,
		specialTermsLoans = form.specialTermsLoans || [],
		specialTermsLoansLength = Object.keys(specialTermsLoans).length,
		balloonPmt = 0;
	
	resultArray = Array.apply(null, Array(years)).map(Number.prototype.valueOf, 0);

	if (view === "bankLoan"){
		for(var i = 0; i < addedBankLoansLength; i++){
			if (addedBankLoans[i].add_bl_interestOnly === "yes"){
				if(addedBankLoans[i].add_bl_balloon){
                    //Calculate Balloon Payment
                    var ballonYear = addedBankLoans[i].add_bl_balloon - 1;
                    balloonPmt = addedBankLoans[i].add_bl_loanAmount;
                }
            }else if (addedBankLoans[i].add_bl_interestOnly === "no"){
                if(addedBankLoans[i].add_bl_balloon){

					//Calculate Loan Payment
					var p = addedBankLoans[i].add_bl_loanAmount;
					var r = (addedBankLoans[i].add_bl_interest/100) / 12;
					var n = addedBankLoans[i].add_bl_amortization * 12;

                    //Current year's loan payment
                    var curStlPaymentAmount = (amortizationCalculation(r, p, n) * 12);

                    //Calculate Balloon Payment
                    var ballonYear = addedBankLoans[i].add_bl_balloon - 1;
                    balloonPmt = calculateNoInterestBalloonPayoff(
                      	addedBankLoans[i].add_bl_loanAmount, 
                      	addedBankLoans[i].add_bl_interest, 
                      	addedBankLoans[i].add_bl_balloon, 
                      	curStlPaymentAmount,
                      	form);
                }
            }
			//Amortization for current loan
			var currentLoanAmort = addedBankLoans[i].add_bl_amortization;

			//after ballon year cash flow needs to contain ballon payments 
			var currentLoanAmort = addedBankLoans[i].add_bl_amortization;
			for(var j = ballonYear + 1; j < currentLoanAmort; j ++){
				resultArray[j] += balloonPmt;
			}
        }
    }else if (view === "specialTermsLoan"){
		for(var i = 0; i < specialTermsLoansLength; i++){
			if (specialTermsLoans[i].stl_interestOption === "yes"){
				if (specialTermsLoans[i].stl_balloon){
					//Adds the Ballon Payment to the given ballon year
					var ballonYear = specialTermsLoans[i].stl_balloon - 1;
					balloonPmt = specialTermsLoans[i].stl_amount;
				}
            }else if (specialTermsLoans[i].stl_interestOption === "no"){
              	if (specialTermsLoans[i].stl_balloon){

                    //calculate current year's amortization
                    p = specialTermsLoans[i].stl_amount;
                    r = (specialTermsLoans[i].stl_interest /100)/ 12;
                    n = specialTermsLoans[i].stl_amortization * 12;
                      
                    //Current Year's loan payment
                    curStlPaymentAmount = (amortizationCalculation(r, p, n) * 12);
                      
                    var ballonYear = specialTermsLoans[i].stl_balloon - 1;
                    balloonPmt = calculateNoInterestBalloonPayoff(
                      	specialTermsLoans[i].stl_amount, 
                      	specialTermsLoans[i].stl_interest, 
                      	specialTermsLoans[i].stl_balloon, 
                      	curStlPaymentAmount,
                      	form);
                }
            }

            //after ballon year cash flow needs to contain ballon payments 
            var currentLoanAmort = specialTermsLoans[i].stl_amortization;
            for(var j = ballonYear + 1; j < currentLoanAmort; j ++){
            	resultArray[j] += balloonPmt;
            }
        }
    }
    return resultArray;
}

function calculateLoanPmts (years, form) {
	var view = form.loanInfoView,
		addedBankLoans = form.loans || [],
		addedBankLoansLength = Object.keys(addedBankLoans).length,
		specialTermsLoans = form.specialTermsLoans || [],
		specialTermsLoansLength = Object.keys(specialTermsLoans).length,
		r,
		p,
		n,
		curStlPaymentAmount,
		yearlyLoanPayments = Array.apply(null, Array(years)).map(Number.prototype.valueOf, 0);

	if (view == "bankLoan"){
		//Calculate Bank Loan Payment
		p = form.li_purchasePrice - form.bl_downPaymentDollar;
		r = (form.bl_interest /100) / 12; 
		n = form.bl_amortization * 12;
		bankLoanPmt = (amortizationCalculation(r, p, n) * 12);

		//Create array of bank loan payments
		var bankLoanAmort = form.bl_amortization;
		var bankLoanPmts = Array.apply(null, Array(bankLoanAmort)).map(Number.prototype.valueOf, bankLoanPmt);

		//Creates the array of loan payments to make each year
		yearlyLoanPayments = combineArrays(yearlyLoanPayments, bankLoanPmts);

		//Add the other loans the user added which have a different format than reg. bank loan
		for (var i = 0; i < addedBankLoansLength; i++) {
			if (addedBankLoans[i].add_bl_interestOnly == "yes"){
		  		//current loan payment for the year
		  		curStlPaymentAmount = addedBankLoans[i].add_bl_loanAmount * (addedBankLoans[i].add_bl_interest / 100);
		  
				//Creates the array for the current loan payments for length of its amortization
				var currentLoanAmort = addedBankLoans[i].add_bl_amortization;
				var currentLoanArray = Array.apply(null, Array(currentLoanAmort)).map(Number.prototype.valueOf, curStlPaymentAmount);
				  
				//Add the currentLoanArray to the rest of the loan arrays
				//since they might all have different amortizations I wrote a special function
				yearlyLoanPayments = combineArrays(yearlyLoanPayments, currentLoanArray);

		  		//if ballon pmt. was added, then the yearly loan payments change
		  		if(addedBankLoans[i].add_bl_balloon){

				    //Adds the Ballon Payment to the given ballon year
				    var ballonYear = addedBankLoans[i].add_bl_balloon - 1;
				    yearlyLoanPayments[ballonYear] = yearlyLoanPayments[ballonYear] + addedBankLoans[i].add_bl_loanAmount;

				    //All loanpayments after ballon payment are 0 
				    for(var j = ballonYear + 1; j < currentLoanAmort; j ++){
				    	yearlyLoanPayments[j] = yearlyLoanPayments[j] - curStlPaymentAmount;
				    }
				}

            } else if (addedBankLoans[i].add_bl_interestOnly == "no"){
				//Calculate Loan Payment
				p = addedBankLoans[i].add_bl_loanAmount;
				r = (addedBankLoans[i].add_bl_interest/100) / 12;
				n = addedBankLoans[i].add_bl_amortization * 12;

                //Current year's loan payment
                curStlPaymentAmount = (amortizationCalculation(r, p, n) * 12);

                //Creates the array for the current loan payments for length of its amortization
                var currentLoanAmort = addedBankLoans[i].add_bl_amortization;
                var currentLoanArray = Array.apply(null, Array(currentLoanAmort)).map(Number.prototype.valueOf, curStlPaymentAmount);

				//Add the currentLoanArray to the rest of the loan arrays
				//since they might all have different amortizations I wrote a special function
				yearlyLoanPayments = combineArrays(yearlyLoanPayments, currentLoanArray);

				//if ballon pmt. was added, then the yearly loan payments change
				if(addedBankLoans[i].add_bl_balloon){

	                //Adds the Ballon Payment to the given ballon year
	                var ballonYear = addedBankLoans[i].add_bl_balloon - 1;
	                yearlyLoanPayments[ballonYear] = yearlyLoanPayments[ballonYear] + 
	                calculateNoInterestBalloonPayoff(
	                	addedBankLoans[i].add_bl_loanAmount, 
	                	addedBankLoans[i].add_bl_interest, 
	                	addedBankLoans[i].add_bl_balloon, 
	                	curStlPaymentAmount,
	                	form);

                    //All loanpayments after ballon payment are 0 
                    for(var j = ballonYear + 1; j < currentLoanAmort; j ++){
                    	yearlyLoanPayments[j] = yearlyLoanPayments[j] - curStlPaymentAmount;
                    }
                }
            }
        }
    } else if (view == "specialTermsLoan"){
        for (var i = 0; i < specialTermsLoansLength; i++) {
        	if (specialTermsLoans[i].stl_interestOption == "yes"){

                //Current year's loan payment
                curStlPaymentAmount = specialTermsLoans[i].stl_amount * (specialTermsLoans[i].stl_interest / 100);
                      
				//Creates the array for the current loan payments for length of its amortization
				var currentLoanAmort = specialTermsLoans[i].stl_amortization;
				var currentLoanArray = Array.apply(null, Array(currentLoanAmort)).map(Number.prototype.valueOf, curStlPaymentAmount);

				//Add the currentLoanArray to the rest of the loan arrays
				//since they might all have different amortizations I wrote a special function
				yearlyLoanPayments = combineArrays(yearlyLoanPayments, currentLoanArray);

                //if the current loan has a ballon payment
                if (specialTermsLoans[i].stl_balloon){
                    //Adds the Ballon Payment to the given ballon year
                    var ballonYear = specialTermsLoans[i].stl_balloon - 1;
                    yearlyLoanPayments[ballonYear] = yearlyLoanPayments[ballonYear] + specialTermsLoans[i].stl_amount;

                    //All loanpayments after ballon payment are 0 
                    for(var j = ballonYear + 1; j < currentLoanAmort; j ++){
                        yearlyLoanPayments[j] = yearlyLoanPayments[j] - curStlPaymentAmount;
                    }
                } 

            } else if (specialTermsLoans[i].stl_interestOption == "no"){
				//calculate current year's amortization
				p = specialTermsLoans[i].stl_amount;
				r = (specialTermsLoans[i].stl_interest /100)/ 12;
				n = specialTermsLoans[i].stl_amortization * 12;
                      
                //Current Year's loan payment
                curStlPaymentAmount = (amortizationCalculation(r, p, n) * 12);

                //Creates the array for the current loan payments for length of its amortization
                var currentLoanAmort = specialTermsLoans[i].stl_amortization;
                var currentLoanArray = Array.apply(null, Array(currentLoanAmort)).map(Number.prototype.valueOf, curStlPaymentAmount);

                //Add the currentLoanArray to the rest of the loan arrays
                //since they might all have different amortizations I wrote a special function
                yearlyLoanPayments = combineArrays(yearlyLoanPayments, currentLoanArray);

                //if the current loan has a ballon payment
                if (specialTermsLoans[i].stl_balloon){
                    //Adds the Ballon Payment to the given ballon year
                    var ballonYear = specialTermsLoans[i].stl_balloon - 1;
                        yearlyLoanPayments[ballonYear] = yearlyLoanPayments[ballonYear] + 
                        calculateNoInterestBalloonPayoff(specialTermsLoans[i].stl_amount, 
                        	specialTermsLoans[i].stl_interest, 
                        	specialTermsLoans[i].stl_balloon, 
                        	curStlPaymentAmount,
                        	form);

                    //All loanpayments after ballon payment are 0 
                    for(var j = ballonYear + 1; j < currentLoanAmort; j ++){
                        yearlyLoanPayments[j] = yearlyLoanPayments[j] - curStlPaymentAmount;
                    }
                } 
			}     
        }
    }
    return yearlyLoanPayments;
}

/*
 * Description: Helper function which adds each item of an array to another
 *              Since the arrays can have different lengths the shorter array will get 
 *              added to the longer array
 * Parameters:  Int arrays expected, could have different lengths
 */
function combineArrays(firstArray, secondArray){
	var length,
		resultArray,
		shorterArray;

	//Assign variables based on array length
	if (firstArray.length > secondArray.length) {
		length = secondArray.length;
		resultArray = firstArray;
		shorterArray = secondArray;
	} else {
		length = firstArray.length;
		resultArray = secondArray;
		shorterArray = firstArray;
	}

	//add each item of the shorterArray to the resultArray
	for (var i = 0; i < length; i++){
		resultArray[i] += shorterArray[i];
	}

	return resultArray;
}

function calculateCapitalExpenditures (years, form) {
    var capitalExpenditures = form.capitalExpenditures || [],
    	capitalExpendituresLength = Object.keys(capitalExpenditures).length,
    	purchasDateYear = new Date(form.li_purchaseDate).getFullYear();

    //Initialize the result array to 0 and set length of array to how many years
    var capExpArray = Array.apply(null, Array(years)).map(Number.prototype.valueOf, 0);
    
    for (var i = 0; i < capitalExpendituresLength; i++) {
    	var capExpYear = (new Date(capitalExpenditures[i].ce_date)).getFullYear();
    	var capExpPosition = capExpYear - purchasDateYear;
    	if(capExpPosition <= capExpArray.length){
        	capExpArray[capExpPosition] = Math.round(form.capitalExpenditures[i].ce_cost);
      	}
    }
    return capExpArray;
}

function calculateFirstYearExpense (firstYearIncome, form){
	var monthlyExpenses = 0,
		yearlyExpenses = 0,
		expenseResult = 0,
		addedUtilities = form.addedUtilities || [],
		//DO TO HERE SHOULD BE ERROR HANDLING INSTEAD
		water = form.u_water || 0,
		sewer = form.u_sewer || 0,
		garbage = form.u_garbage || 0,
		electricity = form.u_electricity || 0,
		naturalGas = form.u_naturalGas || 0,
		internet = form.u_internet || 0,
		maintenanceCost = form.m_costAmount || 0,
		yardMaitenance = form.o_yardMaintenance || 0,
		insurance = form.o_insurance || 0,
		managementFee = form.pm_managementFeeAmount || 0,
		tenantPlacementFee = form.pm_tenantPlacementFee || 0,
		propertyTaxes = form.o_propertyTaxes || 0,
		addedUtilitiesLength = Object.keys(addedUtilities).length,
		vacancyRate = (form.o_vacancyRate || 0) / 100;

		//add up all monthly default utility costs and 
		monthlyExpenses = water + sewer + garbage
			+ electricity + naturalGas
			+ internet + maintenanceCost
			+ yardMaitenance + insurance
			+ managementFee;

		//add up all monthly custom utility costs added by User
		for (var i = 0; i < addedUtilitiesLength; i++) {
			monthlyExpenses += addedUtilities[i].add_u_amount;
		}

		//convert all monthly expenses to yearly cost 
		yearlyExpenses = 12 * ((tenantPlacementFee * vacancyRate)
			+ monthlyExpenses);

		//add the rest of yearly expenses
		expenseResult = yearlyExpenses + propertyTaxes
			+ (vacancyRate * firstYearIncome);

	return expenseResult;
}

function calculateFirstYearIncome (form){
	var income,
		supplementalIncomes = form.supplementalIncomes || [],
		units = form.units || [],
		supplementalIncomesLength = Object.keys(supplementalIncomes).length,
		unitsLength = Object.keys(units).length,
		sumOfGrossMonthlySupplementalIncome = 0,
		sumOfGrossMonthlyUnitIncome = 0;

	for (var i = 0; i < supplementalIncomesLength; i++) {
		if(supplementalIncomes[i].si_grossMonthlyIncome){
			sumOfGrossMonthlySupplementalIncome += supplementalIncomes[i].si_grossMonthlyIncome;
		}
	}

	for (var i = 0; i < unitsLength; i++) {
		if(units[i].ri_grossMonthlyIncome){
			sumOfGrossMonthlyUnitIncome += units[i].ri_grossMonthlyIncome;
		}
	}

	income = (sumOfGrossMonthlySupplementalIncome + sumOfGrossMonthlyUnitIncome) * 12;

	return income;
}