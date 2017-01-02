App.factory('Image', function($http) {
	return {
		getImages: function (){
			return $http({
				method: 'GET',
				url: "/images",
			});
		},
		deleteImage: function (filename){
			return $http({
				method: 'DELETE',
				url: "/images/" + filename
			});
		},
		uploadImage: function (data){
			return $http({
				method: 'POST',
				url: "/images",
				data: data,
				transformRequest: angular.identity, //transformRequest function will try to serialize our FormData object, so we override it with the identity function to leave the data intact
	            headers: {'Content-Type': undefined} //Angular’s default Content-Type header for POST and PUT requests is application/json, ‘Content-Type’: undefined, the browser sets the Content-Type to multipart/form-data
			});
		}
	}
});