App.factory('Blog', function($http) {
	return {
		getBlogs: function (){
			return $http({
				method: 'GET',
				url: "/blogs"
			});
		},
		deleteBlog: function (blogKey){
			return $http({
				method: 'DELETE',
				url: "/blogs/" + blogKey
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