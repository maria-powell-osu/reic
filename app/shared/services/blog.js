App.factory('Blog', function($http) {
	return {
		getBlogs: function (){
			return $http({
				method: 'GET',
				url: "/blogs"
			});
		},
		postBlog: function (data){
			return $http({
				method: 'POST',
				url: "/blogs",
				data: data
			});
		}

	}
});