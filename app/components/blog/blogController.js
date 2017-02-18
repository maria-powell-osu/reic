App.controller("BlogController", function(vcRecaptchaService, $http, $scope, Comments, Blog, $location, $routeParams, SEO) {
	var vm = this;
    vm.newComment = {};
    vm.view = "blogList";
    vm.error = false;
    vm.missingFields = [];
    vm.publicKey = "6Le7FCoTAAAAAJLEqXtMZeRkxnP_jg_DDqmqsuJH";
    vm.metaTag = "Your source for information on the best passive income investments and personal finance topics on how to create a lifestyle free of money worries.";
    vm.titleTag = "Plan Passive Blog";

    Blog.getBlogs()
        .success(function (blogs) {
            //If the user routed to specific blog
            if ($routeParams.blogTitle){
                vm.view = "viewBlog";

                //extract the blog title from the URL
                var blogTitle = $routeParams.blogTitle.split('-').join(' ');

                //Iterate through the blogs to see which one should get shown
                for(var i = 0; i < blogs.length; i++){
                    if(blogTitle.toLowerCase() == blogs[i].title.toLowerCase()){
                        //set the blog for the view
                        vm.currentBlogView = blogs[i];

                        //setup the seo tags
                        vm.metaTag = vm.currentBlogView.metaTag;
                        vm.titleTag = vm.currentBlogView.titleTag; 
                        break;
                    }
                }
                //If blogTitle was given but it is not found in the results
                if(!vm.currentBlogView){
                    $location.path( "blogs/");
                }
            }
            vm.blogs = blogs;
            SEO.set(vm.metaTag, vm.titleTag);
        })
        .error (function (error) {
            //Need to add error handling here ***********************************
            var test = error;
        });

    vm.showBlog = function (blog) {
        //Create Blog Title for URL - add hyphen between each word for SEO
        hyphenatedBlogTitle = blog.title.split(' ').join('-').toLowerCase();;

        //Update route
        $location.path( "blogs/" + hyphenatedBlogTitle);

        //Change view to specific blog
        vm.view = "viewBlog";

        vm.currentBlogView = blog;

        SEO.set(blog.metaTag, blog.titleTag);

    }

    vm.submitNewComment = function (blog, respondsTo, originalComment){
        vm.error = false;
        vm.missingFields = [];

        //validate fields are there
        if(!vm.newComment.content){
            vm.error = true;
            vm.missingFields.push("Comment");
        } 
        if (!vm.newComment.name){
           vm.error = true;
           vm.missingFields.push("Name");
        }
        if(!vm.newComment.email){
            vm.error = true;
            vm.missingFields.push("Email");
        } 

        if(!blog.captchaResponse || blog.captchaResponse === ""){
                vm.error = true;
                vm.missingFields.push("Captcha");
        }

        if(vm.error == false ){
            //Grab User Input Date
            vm.newComment.blogKey = blog.key;
            vm.newComment.date = String(new Date());
            //Only send this field if it is not a first level comment
            if(respondsTo && respondsTo != ""){
                vm.newComment.respondsTo = respondsTo;
            }
            vm.newComment.captcha = blog.captchaResponse  //send g-captcah-reponse to our server
                
            var jsonData = JSON.stringify(vm.newComment);

            //Save Comment to database
            Comments.postComment(jsonData)
            .success(function (response){
                //if it is a comment of a comment, add new comment to original comment
                if(response.respondsTo){
                    originalComment.responses.push(response);
                //If it is general comment add it to comments list in blog
                } else{
                    blog.comments.push(response);
                }
                vm.newComment = {};
            })
            .error (function (error) {
                //Error Handling Needed ****************************
            });
        }
    }

    vm.cancelComment = function () {
    	//vm.replyActive = false;
        vm.error = false;
        vm.missingFields = [];
        vm.newComment = {};
    };
});
