/*
 * 	Since this is a out of the norm set-up, let me explain my reasoning
 * 	1) I chose bootstrap modal because it is responsive on web pages
 * 	2) Nesting the onclick events for the modal caused timing issues
 * 		So I created modal with the delete button outside the ng-repeat to separate them
 *  3) Bootstrap modal does not accept parameters so I am using the angular model to pass params
 */

/*
 * Bootstrap Delete Modal Dialog 
 */
App.directive('mpModalDelete', function () {
	return {
		restrict: 'A',
		scope: {
			key: "=",   				
			//blogs: "=", 				//List of all blogs 
			index: "=",  				//Index of current blog
			currentBlogInformation: "=" //Carries current blog information into delete button
		},
		link: function (scope,element, attrs, ctrl){
			//User clicked Delete Icon - Shows Bootstrap Dialog Box
			$(element).click(function() {
				//Save the selected blog information, this will be delete button param
				scope.currentBlogInformation.key = scope.key;
				scope.currentBlogInformation.index = scope.index;

				//Activate Bootstrap Modal
				$("#mpModalDelete").modal('show');				
			});

			
		}
	};
});

/*
 * Bootstrap Edit Modal Dialog 
 */
App.directive('mpModalPost', function () {
	return {
		restrict: 'A',
		link: function (scope,element, attrs, ctrl){
			//User clicked Delete Icon - Shows Bootstrap Dialog Box
			$(element).click(function() {
				//Activate Bootstrap Modal
				$("#mpModalPost").modal('show');		
			});

			
		}
	};
});

/*
 * Bootstrap Preview Modal Dialog 
 */
App.directive('mpModalPreview', function () {
	return {
		restrict: 'A',
		link: function (scope,element, attrs, ctrl){
			//User clicked Delete Icon - Shows Bootstrap Dialog Box
			$(element).click(function() {
				//Activate Bootstrap Modal
				$("#mpModalPreview").modal('show');		
			});

			
		}
	};
});