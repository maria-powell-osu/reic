App.controller("AdminController", function($scope, Blog, Admin) {
    var vm = this;
    setupInputFormDefaultData();
    vm.blog = {};
    vm.currentBlogInformation = {};
    vm.view = "postBlog";
    vm.showBlogForm = false;
    vm.blogPostedMessage = false;
    vm.notification = "You are not signed in at the momement.";
    vm.buttonText = "Sign In";
    vm.publicKey = "6Le7FCoTAAAAAJLEqXtMZeRkxnP_jg_DDqmqsuJH";

    Blog.getBlogs()
        .success(function (response){
            vm.blogs = response;
        })
        .error (function (error) {
            vm.errorMessage = error.message;
        });

    //Check User Credentials
    Admin.isAdmin()
        .success(function (response){
            if (response.isSignedIn){   
                vm.notification = "";
                vm.buttonText = "Sign Out";
                if(response.isAdmin){
                    vm.showBlogForm = true;
                } else {
                    vm.notification = "This account does not have administrative permissions.";
                }
            } 
            vm.link = response.link
        })
        .error (function (error) {
            vm.notification = "Oops. Something went wrong. Contact Maria."
        });


    vm.removeParagraph= function() {
        var lastItem = vm.input.paragraphs.length-1;
        vm.input.paragraphs.splice(lastItem);
    };

     vm.addParagraph = function(paragraph) {
     var p = (typeof paragraph !== 'undefined') ?  paragraph : {};
     vm.input.paragraphs.push(p);
    };

    vm.deleteBlog = function(){
        Blog.deleteBlog(vm.currentBlogInformation.key)
        .success(function (response){
            vm.blogs.splice(
                vm.currentBlogInformation.index, 1);
        })
        .error (function (error) {
            //Error Handling Needed ****************************
        });
    }

    vm.editBlog = function (blog) {

        //Populate the inputs with blog information
        vm.input.title = blog.title;
        vm.input.author = blog.author;
        vm.input.date = blog.date;
        vm.input.key = blog.key;
        vm.input.image = blog.image;
    
        //Make sure there is no objects in paragraphs (typically there is one for user to be required to enter 
            //at least one paragraph)
        vm.input.paragraphs = []

        for (i = 0; i < blog.paragraphs.length; i++) {
            vm.addParagraph(blog.paragraphs[i]);
        }

        //Show Post Blog Screen
        vm.view = "postBlog";
        vm.blogAction = "edit";
    };

    vm.updateBlog = function(){
        //add order indices for paragraphs
        for(i = 0; i < vm.input.paragraphs.length; i++){
            vm.input.paragraphs[i].index = i;
        }
        
        var jsonData = JSON.stringify(vm.input);
        
        Blog.editBlog(jsonData)
        .success(function (response){
            //Update the view with the new blog
            for (i = 0; i < vm.blogs.length; i++){
                if (vm.blogs[i].key == response.key){
                    vm.blogs[i] = response;
                }
            }
            setupInputFormDefaultData();
            vm.blogPostedMessage = true;
            $(window).scrollTop(0);

        })
        .error (function (error) {
            vm.errorMessage = error.message;
            $(window).scrollTop(0);
        });
    }

    //Post New Blog
    vm.postBlog = function (){
        //add order indices for paragraphs
        for(i = 0; i < vm.input.paragraphs.length; i++){
            vm.input.paragraphs[i].index = i;
        }
        var jsonData = JSON.stringify(vm.input);
        
        Blog.postBlog(jsonData)
        .success(function (response){
            //Save the blog key gotten from DB
            vm.input['key'] = response.key;

            //Add the new blog to site list
            vm.blogs.push(vm.input);

            //Reset the blog data so that form is cleared
            setupInputFormDefaultData();

            //Show user "Blog posted" message
            vm.blogPostedMessage = true;

            //Scroll the page back to top
            $(window).scrollTop(0);
        })
        .error (function (error) {
            //Error Handling Needed ****************************
        });
    };

    //Cancel Blog Form and Clear It
    vm.cancelBlog = function () {
        setupInputFormDefaultData();
     };

    function setupInputFormDefaultData(){
        vm.input = {};
        vm.input.paragraphs = [{}];
        vm.input.date = getCurrentDate();
        vm.blogAction = "new";
    }
});



function getCurrentDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    var result = mm+'/'+ dd +'/'+ yyyy;
    return result;
}