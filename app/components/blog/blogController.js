App.controller("BlogController", function($scope, Comments, Blog) {
	var vm = this;
    vm.newComment = {};
    vm.replyActive = false;

    Blog.getBlogs()
        .success(function (blogs) {
            vm.blogs = blogs;
        })
        .error (function (error) {
            //Need to add error handling here ***********************************
            var test = error;
        });

    //Retrieve the comments and load them onto the page
    Comments.getComments()
        .success(function (comments) {
            //Associate the comments with the blog
                //vm.blogs[blogKey].comments = comments;
            //Add amount of comments for display
                //vm.blogs[blogKey].numberOfComments = comments.length;
        })
        .error (function (error) {
            //Need to add error handling here ***********************************
            var test = error;
        });

    var today = new Date().toDateString();

    vm.reply = function () {
    	vm.replyActive = true;
    };

    vm.submitNewComment = function (){
        vm.newComment.blogId = 1;
        vm.newComment.commentId = 1;
        vm.newComment.date = today;
        var jsonData = JSON.stringify(vm.newComment);
        Comments.postComment(jsonData)
        .success(function (response){
            vm.comments.push({ name: vm.newComment.name, email: vm.newComment.email, date: vm.newComment.date, content: vm.newComment.content });
            vm.replyActive = false;
            vm.newComment = {};
        })
        .error (function (error) {
            //Error Handling Needed ****************************
        });
    }

    vm.cancelComment = function () {
    	vm.replyActive = false;
        vm.newComment = {};
    };
});
