'use strict';

App.directive('mpBlog', function() {
	return {
		scope: {blog: "="},
		restrict: 'E',
		templateUrl: '/app/components/blog/blogTemplate.html'
	};
});

/*App.directive('mpComment', function() {
	return {
		scope: {blog: "=", level: "="},
		restrict: 'E',
		templateUrl: '/app/components/blog/commentTemplate.html'
	};
});*/