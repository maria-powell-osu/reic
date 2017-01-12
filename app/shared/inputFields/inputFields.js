
'use strict'
/*
 * Sets up the asterix on required fields
 * Required the input to have a label before it
 */
App.directive("mpRequired", function($timeout) {
   return {
      restrict: 'A', //only want it triggered for attributes
      link: function(scope, element, attrs, ctrl) {
        $(element[0]).prepend("<b class='text-danger'>* </b>");
      }
   };
});

App.directive('jqdatepicker', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            $(element).datepicker({
                dateFormat: 'mm/dd/yy',
                changeMonth: true,
                changeYear: true,
                onSelect: function(date) {
                    ctrl.$setViewValue(date);
                    ctrl.$render();
                    scope.$apply();
                }
            });
        }
    };
});


/*
 * Purpose: Handles drag and drop events
 * Code Exp: 
 * 			- restrict in order to specify that this directive only gets triggered by attribute name
 * 			- (isolate) scope creates child scope instead of using parent scope (FileController). 
 * 				It makes it a reusable directive because we no longer rely on the parent scope.
 * 				To bind use three local scope properties @, =, or & 
 * 					@ - to access string values that are defined outside the directive
 *					= - to create a two-way binding between the outer scope and the directive’s isolate scope
 *					& - to pass in a function that the directive can invoke
 * 			- link to register DOM listeners or update DOM
 */
/*App.directive('droppable', function() {
	return {
		restrict: 'A',
		scope: {
			file: '=',
			fileName: '='
		},
		link: function(scope, element, attrs) {
			//Define in html the valid file types
			var validFileTypes = attrs.fileDropZone;
			
			//Add event handler for drag starter events to make them droppable for copies
			element.bind('dragover dragenter', function (event) {
				//Allows the area to be droppable since default is not droppable
				if (event != null) {
					event.preventDefault();
				}
				//Specifies that only copies are allowed for drag operation
				//event.originalEvent.dataTransfer.effectAllowed = 'copy';

				//add styling 
				$( "#dashedDiv").removeClass("dashedPlaceholder");
                $( "#dashedDiv").addClass("dashedHoverPlaceholder");

				return false;
			});

			//Add event handler for drag end events for styling only
			element.bind('dragleave dragend dragexit', function (event) {
				//add styling 
				$( "#dashedDiv").removeClass("dashedHoverPlaceholder");
                $( "#dashedDiv").addClass("dashedPlaceholder");
			});

			//Add event handler for drop event
			return element.bind('drop', function (event) {
				var file, fileName, fileSize, fileType,
				fileReader = new FileReader();


				if (event != null) {
					event.preventDefault();
				}

				//triggered when reading completed
				fileReader.onload = function (event) {
					if (checkFileType(fileType)) {
						//New styling after picture added
						pictureAddedStyling();
						return scope.$apply(function () {
							scope.file = event.target.result;
							if (angular.isString(scope.fileName)) {
								return scope.fileName = name;
							}
						});
					}
				};

				//extract file and file information from dataTransfer in event
				file = event.originalEvent.dataTransfer.files[0];
				fileName = file.name;
				fileType = file.type;
				fileSize = file.size;
				//Begins reading from blob as a 'data:' url string: for images
				fileReader.readAsDataURL(file);
				return false;
			});

			//validates that the file is the proper type
			function checkFileType (type) {
				if (validFileTypes === '' || validFileTypes === (void 0) || validFileTypes.indexOf(type) > -1) {
					return true;
				} else {
					//TODO: error handler
					return false;
				}
			}
		}
	};
})*/

App.directive("cloudStorageFileUpload", ['$parse', 'Image', function ($parse, Image) {
	return {
		scope: {
			//cloudStorageFileUpload: "=", //saves actual file
			blogBlobs: "=",		
			errorMessage: "=",			//saves the file blob used to display back to user
			imageInfo: "="					//contains the list of images already uploaded - for images overview screen
		},
		link: function (scope, element, attrs) {

			element.bind("change", function (changeEvent) {
				var form = new FormData();
				form.append('image', changeEvent.target.files[0]);
		        Image.uploadImage(form)
		            .success(function (response){
		                //add the new image to the images list in image tab
		                scope.imageInfo.push(response);
            			
						var reader = new FileReader();

						//triggered when reading completed
						reader.onload = function (loadEvent) {
							scope.$apply(function () {
								var object = {};

								object.blob = loadEvent.target.result;
								object.url = response.url;
								//Saving the blob so we can display it
								scope.blogBlobs.push(object);

								 //Remove value from input source
		                		$('#' + element[0].id).val('');
							});
						}
						//Begins reading from blob as a 'data:' url string: for images
						reader.readAsDataURL(changeEvent.target.files[0]);
					})
		            .error (function (error) {
		                 if (error && error.message){
		                    scope.errorMessage = error.message;
		                } else {
		                    scope.errorMessage = "Internal Server Error.";
		                }
		                $(window).scrollTop(0);
		            });

			});
			scope.$watch('filereader', function (newValue, oldValue) {
		          //if the value has change and the value is not defined 
		          //that means the controller is trying to clear the field
		          if (newValue !== oldValue && !newValue) {     
		          	//Clears the file input value    	
		          	$('#' + element[0].id).val('');
		          }

		          //Need if option to delete old image
      		});
		}
	}
}]);

App.directive("filereader", ['$parse', function ($parse) {
	return {
		scope: {
			//filereader: "=", //saves actual file
			blob: "="		//saves the file blob used to display back to user
		},
		link: function (scope, element, attrs) {
			//var model = $parse(scope.filereader);
            //var modelSetter = model.assign;

			element.bind("change", function (changeEvent) {
				var reader = new FileReader();
				//scope.filereader = changeEvent.target.files[0];

				//triggered when reading completed
				reader.onload = function (loadEvent) {
					scope.$apply(function () {
						scope.blob = loadEvent.target.result;
						//scope.filereader = changeEvent.target.result;
					});
				}
				//Begins reading from blob as a 'data:' url string: for images
				reader.readAsDataURL(changeEvent.target.files[0]);

			});
			scope.$watch('filereader', function (newValue, oldValue) {
		          //if the value has change and the value is not defined 
		          //that means the controller is trying to clear the field
		          if (newValue !== oldValue && !newValue) {     
		          	//Clears the file input value    	
		          	$('#' + element[0].id).val('');
		          }
      		});
		}
	}
}]);

App.directive('removeimage', function() {
	return {
		scope: {},
		link: function (scope, element, attrs) {
			element.bind("click", function (event) {
				$( "#propertyImage").hide();
				$(".innerDashedPlaceHolder" ).show();
				$( "#removeImage").hide();
			});
		}
	};

});



/*
 * Purpose: Helper method to style the image box after user added picture
 * Params: 
 */
/*function pictureAddedStyling () {
	//Remove the hover style effect in case it was invoked before
	$("#dashedDiv").removeClass("dashedHoverPlaceholder");
	//Add Styling for original dashed box
	$("#dashedDiv").addClass("dashedPlaceholder");
	//Remove the drop text since picture is added
	$(".innerDashedPlaceHolder" ).hide();
	//Show delete image button
	$("#removeImage").show();
	$( "#propertyImage").show();
}*/

/*App.directive('mpValidation', function($timeout) {
    return {
        restrict: 'A',
        scope: { formName: '=' },
        link: function(scope, element, attrs, ctrl) {
        	$timeout(function() {
        		var test = scope['formName'];
        		var resultArray = [];   
            	var t = $('#rentalCalculatorInputForm *').filter(':input').each(function(index, element){
            		if(element.required && element.value == ""){
            			resultArray.push(element);
            		}
            	});
            });
        }
    };
});
*/

/*App.directive('jqSlideSection', function($timeout) {
    return {
        link: function(scope, element, attrs, ctrl) {
            //$timeout to make sure everything is loaded properly before this
            $timeout(function() {   
                //if you want to hide them at some point do:
                //$('#accordion .ui-accordion-content ').hide();

                // header click event
                $('#accordion .accordion-header').click(function() {
                    //gets the sibling element which is the content of the header
                    var contentOfHeader = $(this).next();
                    var isContentOpen = contentOfHeader.is(':visible');
                 
                    contentOfHeader[isContentOpen? 'slideUp': 'slideDown']()
                        // toggle between hide and show
                        .trigger(isContentOpen? 'hide': 'show');

                    // this prevents a pagescroll
                    return false;
                });
            });
        }
    };
});*/

/*App.directive('jqTabs', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            $timeout(function() {  
                $(element).tabs();
            });
        }
    };
});*/

