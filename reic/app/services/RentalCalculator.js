App.factory('RentalCalculator', function() {
	//Basic Property Information
	RentalCalculator = {};
	RentalCalculator.bp_repTitle = '';
	RentalCalculator.bp_preparedFor = '';
	RentalCalculator.bp_streetAddress = '';
	RentalCalculator.bp_city = '';
	RentalCalculator.bp_state = '';
	RentalCalculator.bp_zipCode = '';
	RentalCalculator.bp_propertyImage = '';
	RentalCalculator.bp_description = '';

	//Loan Information
	RentalCalculator.li_bankLoanPurchasePrice = '';
	RentalCalculator.li_bankLoanPurchaseDate = '';

	//Loan Information - Bank Loan
	RentalCalculator.bl_loanName = '';
	RentalCalculator.bl_downPaymentDollar = '';
	RentalCalculator.bl_closingCost = '';
	RentalCalculator.bl_interest = '';
	RentalCalculator.bl_downPaymentPercent = '';
	RentalCalculator.bl_amortization = '';
	RentalCalculator.bl_extraPrincipal = '';
	RentalCalculator.bl_startDate = '';
	RentalCalculator.bl_endDate = '';
	RentalCalculator.add_bl_loanName = '';
	RentalCalculator.add_bl_amount = '';
	RentalCalculator.add_bl_interest = '';
	RentalCalculator.add_bl_amortization = '';
	RentalCalculator.add_bl_balloonDate = '';
	RentalCalculator.add_bl_upFrontLenderPoints = '';
	RentalCalculator.add_bl_interestOnly = '';

	//Loan Information - Special Terms Loan
	RentalCalculator.stl_loanName = '';
	RentalCalculator.stl_amount = '';
	RentalCalculator.stl_interest = '';
	RentalCalculator.stl_amortization = '';
	RentalCalculator.stl_balloonDate = '';
	RentalCalculator.stl_upFrontLenderPoints = '';
	RentalCalculator.stl_interstOnly = '';

	//Income Sources - Rental Income
	RentalCalculator.ri_annualRentIncrease = '';
	RentalCalculator.ri_unitName = '';
	RentalCalculator.ri_grossMonthlyIncome = '';

	//Income Sources - Supplemental Income
	RentalCalculator.si_description = '';
	RentalCalculator.si_grossMonthlyIncome = '';
	
	//Expenses
	RentalCalculator.e_annualExpenseIncrease = '';

	//Expenses - Utilities
	RentalCalculator.u_water = '';
	RentalCalculator.u_sewer = '';
	RentalCalculator.u_garbage = '';
	RentalCalculator.u_electricity = '';
	RentalCalculator.u_naturalGas = '';
	RentalCalculator.u_internet = '';
	RentalCalculator.add_u_name = '';
	RentalCalculator.add_u_amount = '';

	//Expenses - Maitenance
	RentalCalculator.m_costAmount = '';
	RentalCalculator.m_costPercent = '';

	//Expenses - Oter
	RentalCalculator.o_yardMaintenance = '';
	RentalCalculator.o_vacancyRate = '';
	RentalCalculator.o_insurance = '';
	RentalCalculator.o_propertyTaxes = '';
	RentalCalculator.add_e_name = '';
	RentalCalculator.add_e_cost = '';

	//Expenses - Property Management
	RentalCalculator.pm_managementFeeAmount = '';
	RentalCalculator.pm_tenantPlacementFee = '';
	RentalCalculator.pm_managementFeePercent = '';

	//Expenses - Capital Expenditures
	RentalCalculator.ce_description = '';
	RentalCalculator.ce_Cost = '';
	RentalCalculator.ce_date = '';

	//Financial Measures
	RentalCalculator.fm_typicalRapRate = '';
	RentalCalculator.fm_afterRepairValue = '';
	RentalCalculator.fm_assumedAppreciation = '';
	RentalCalculator.fm_desiredReturn = '';
	RentalCalculator.fm_arvDate = '';
	RentalCalculator.fm_landValue = '';

	return {
		getData: function(){
			return RentalCalculator;
		},
		setData: function (rentalCalculatorData){
			RentalCalculator = rentalCalculatorData;
		}
	}
});

