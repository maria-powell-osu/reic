App.directive('clearForm', function() {
	return {
		scope: {},
		link: function (scope, element, attrs) {
			element.bind("click", function (event) {
				$("#dialog-confirm").dialog({
	                resizable: false,
	                height: 250,
	                width: 400,
	                modal: true,
	                buttons: {
	                    "Clear Fields": function() {
	                    	$('#rentalCalculatorInputForm')[0].reset();
	                        $(this).dialog("close");
	                    },
	                    Cancel: function() {
	                        $(this).dialog("close");
	                    }
	                }
	            });
			});
		}
	};

});