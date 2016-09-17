App.directive('mpModal', function (Blog) {
	return {
		restrict: 'A',
		scope: {
			key: "=",
			blogs: "=",
			index: "="
		},
		link: function (scope ,element, attrs, ctrl){
			$(element).click(function() {
				$("#mpModal").modal('show');

				$("#deleteBlog").click(function() {
					Blog.deleteBlog(scope.key)
				        .success(function (response){
				            scope.blogs.splice(scope.index, 1);
				        })
				        .error (function (error) {
				            //Error Handling Needed ****************************
				        });
				});
			});
		}
	};
});
/*App.directive('jqConfirmDialog', function (Blog) {
	return {
		restrict: 'A',
		scope: {
			key: "=",
			blogs: "=",
			index: "="
		},
		link: function (scope ,element, attrs, ctrl){
			$(element).click(function() {
				$("#dialog-confirm").dialog({
					resizable: false,
					height: "auto",
					width: 400,
					modal: true,
					buttons: {
						text: "Delete", 
						click: function() {
							Blog.deleteBlog(scope.key)
					        .success(function (response){
					            scope.blogs.splice(scope.index, 1);
					            $( this ).dialog( "close" );
					        })
					        .error (function (error) {
					            //Error Handling Needed ****************************
					        });
						},
						Cancel: function() {
							$( this ).dialog( "close" );
						}
					}
				});
				//$("#dialog-confirm").show()
			});
		}
	};
});*/