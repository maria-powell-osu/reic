App.factory('Blog', function($http) {
	return {
		getBlogs: function (){
			return $http({
				method: 'GET',
				url: "/blogData"
			});
		},
		deleteBlog: function (blogKey){
			return $http({
				method: 'DELETE',
				url: "/blogData/" + blogKey
			});
		},
		editBlog: function (data){
			return $http({
				method: 'PUT',
				url: "/blogData",
				data: data
			});
		},
		postBlog: function (data){
			return $http({
				method: 'POST',
				url: "/blogData",
				data: data,
			});
		}
	}
});