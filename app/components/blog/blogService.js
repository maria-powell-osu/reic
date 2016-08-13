App.factory('Comments', function($http) {
	return {
		getComments: function (){
			return $http({
				method: 'GET',
				url: "/comments"
			});
		},
		postComment: function (data){
			return $http({
				method: 'POST',
				url: "/comments",
				data: data
			})
		}

	}
});