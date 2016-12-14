App.controller("BlogController", function($scope, Comments, Blog, $location, $routeParams) {
	var vm = this;
    vm.newComment = {};
    vm.replyActive = false;
    vm.view = "blogList";
    vm.error = false;
    vm.missingFields = [];

    Blog.getBlogs()
        .success(function (blogs) {
            //If the user routed to specific blog
            if ($routeParams.blogTitle){
                vm.view = "viewBlog";
                var blogTitle = $routeParams.blogTitle.split('-').join(' ');

                for(var i = 0; i < blogs.length; i++){
                    if(blogTitle == blogs[i].title){
                        vm.currentBlogView = blogs[i];
                        break;
                    }
                }
                //If blogTitle was given but it is not found in the results
                if(!vm.currentBlogView){
                    $location.path( "blog/");
                }
            }
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
        $location.path( "blog/" + hyphenatedBlogTitle);

        //Change view to specific blog
        vm.view = "viewBlog";

        vm.currentBlogView = blog;

    }

    var today = new Date().toDateString();

    vm.reply = function () {
    	vm.replyActive = true;
    };

    vm.submitNewComment = function (blog, level){
        vm.error = false;
        vm.missingFields = [];

        //validate fields are there
        if(!vm.newComment.content){
            vm.error = true;
            vm.missingFields.push("Comment")
        } 
        if (!vm.newComment.name){
           vm.error = true;
           vm.missingFields.push("Name")
        }
        if(!vm.newComment.email){
            vm.error = true;
            vm.missingFields.push("Email")
        } if(!vm.newComment.spammer){
            vm.error = true;
            vm.missingFields.push("Spammer Checkbox")
        }

        if(vm.error == false){
            //Grab Data
            vm.newComment.blogKey = blog.key;
            vm.newComment.index = blog.comments.length + 1;
            vm.newComment.date = today;
            var jsonData = JSON.stringify(vm.newComment);

            //Save Comment to database
            Comments.postComment(jsonData)
            .success(function (response){
                //find current blog and add comment to list
                for (var i = 0; i < vm.blogs.length; i++){
                    if(vm.blogs[i].key == blog.key){
                        blog.comments.push(vm.newComment);
                        break;
                    }
                }
                vm.replyActive = false;
                vm.newComment = {};
            })
            .error (function (error) {
                //Error Handling Needed ****************************
            });
        }
    }

    vm.cancelComment = function () {
    	vm.replyActive = false;
        vm.error = false;
        vm.missingFields = [];
        vm.newComment = {};
    };
});
