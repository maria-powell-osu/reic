App.directive('addBankLoanView', function() {
	return {
		scope: {},
		link: function (scope, element, attrs) {
			element.bind("click", function (event) {
				//Determine how many rows have been entered
				var numberOfRows = $('#rwCountBankLoanView').val() || 1;
				var newRowNumber = numberOfRows + 1;
				$('#rwCountBankLoanView').val(newRowNumber);

				//Create Header Element
				var firstLoanHeader = document.createElement("h4");
				var name = document.createTextNode(newRowNumber + ' . Loan');
    			firstLoanHeader.appendChild(name);

    			//Insert Header Element

    			//Clone 
    			var newRow = $('#rwBankLoanView').clone().find("input:text").val("").end()

				$("#rwBankLoanView").after(newRow);
			});
		}
	};

});