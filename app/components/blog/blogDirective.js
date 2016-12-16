'use strict';

App.directive('mpBlog', function() {
	return {
		scope: {blog: "=blog"},
		restrict: 'E',
		templateUrl: '/app/components/blog/templates/blogTemplate.html'
	};
});

App.directive('mpComment', function() {
	return {
		scope: {
			comment: "=comment",
			level: "=level",
			blog: "=blog"
		},
		restrict: 'E',
		templateUrl: '/app/components/blog/templates/commentViewTemplate.html'
	};
});
App.directive('mpCommentReplyForm', function() {
	return {
		scope: {
			blog: "=blog",
			formid: "=formid",
			respondsTo: "=respondsTo",
			originalComment: "=originalComment"
		},
		restrict: 'E',
		templateUrl: '/app/components/blog/templates/commentReplyTemplate.html'
	};
});