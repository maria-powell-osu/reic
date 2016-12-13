'use strict';

App.directive('mpBlog', function() {
	return {
		scope: {blog: "="},
		restrict: 'E',
		templateUrl: '/app/components/blog/blogTemplate.html'
	};
});