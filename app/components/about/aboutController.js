App.controller("AboutController", function($scope, Comments, Blog, $location, $routeParams) {
	var vm = this;

    Blog.getBlogs()
        .success(function (blogs) {
        vm.blogs = blogs;
        })
        .error (function (error) {
            //Need to add error handling here ***********************************
            var test = error;
        });

    vm.showBlog = function (blog) {
        //Create Blog Title for URL - add hyphen between each word for SEO
        hyphenatedBlogTitle = blog.title.split(' ').join('-');

        //Update route
        $location.path( "blogs/" + hyphenatedBlogTitle);

        //Change view to specific blog
        vm.view = "viewBlog";

        vm.currentBlogView = blog;
    }

});
