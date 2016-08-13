App.factory('Comments', function($http) {
	return {
		getComments: function (){
			return $http({
				method: 'GET',
				url: "/comments",
				/*transformResponse: function (data, headersGetter, status) {
			        //This was implemented since the REST service is returning a plain/text response
			        //and angularJS $http module can't parse the response like that.
			        return {data: data};
			    }*/
			});
		}

	}
});