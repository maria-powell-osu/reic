App.factory('RentalCalculator', function() {
	var RentalCalculator = {};
	return {
		getData: function(){
			return RentalCalculator;
		},
		setData: function (rentalCalculatorData){
			RentalCalculator = rentalCalculatorData;
		}
	}
});

