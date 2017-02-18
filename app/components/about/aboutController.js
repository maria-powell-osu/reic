App.controller("AboutController", function($scope, Comments, Blog, $location, $routeParams, SEO) {
	var vm = this;
        vm.titleTag = "Plan Passive – Passive Income for a Free Life";
        vm.metaTag = 'Plan your ideal lifestyle by creating passive income streams. Make your money work hard so you don’t have to. Home of the best Rental Property Calculator.';

    Blog.getBlogs()
        .success(function (blogs) {
        vm.blogs = blogs;
        })
        .error (function (error) {
            //Need to add error handling here ***********************************
            var test = error;
        });

    SEO.set(vm.metaTag, vm.titleTag);

    vm.showBlog = function (blog) {
        //Create Blog Title for URL - add hyphen between each word for SEO
        hyphenatedBlogTitle = blog.title.split(' ').join('-').toLowerCase();

        //Update route
        $location.path( "blogs/" + hyphenatedBlogTitle);

        //Change view to specific blog
        vm.view = "viewBlog";

        vm.currentBlogView = blog;
    }

});
