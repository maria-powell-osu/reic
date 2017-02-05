App.controller("AdminController", function($scope, Blog, Admin, Image) {
    var vm = this;
    setupInputFormDefaultData();
    vm.blog = {};
    vm.currentBlogInformation = {};
    vm.currentImageInformation = {};
    vm.view = "postBlog";
    vm.showBlogForm = false;
    vm.blogPostedMessage = false;
    vm.notification = "You are not signed in at the momement.";
    vm.buttonText = "Sign In";
    vm.publicKey = "6Le7FCoTAAAAAJLEqXtMZeRkxnP_jg_DDqmqsuJH";

    vm.tinymceOptions = {
        plugins: 'advlist autolink link image lists charmap preview textcolor colorpicker table autoresize',
        skin: 'lightgray',
        theme: 'modern',
        toolbar: "undo redo | fontsizeselect bold italic | forecolor backcolor | alignleft aligncenter alignright | link image | table",
        fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt'
    };

    Image.getImages()
        .success(function (response){
            vm.imageInfo = response;
        })
        .error (function (error) {
             if (error && error.message){
                vm.errorMessage = error.message;
            } else {
                vm.errorMessage = "Internal Server Error.";
            }
            $(window).scrollTop(0);
        });


    Blog.getBlogs()
        .success(function (response){
            vm.blogs = response;
        })
        .error (function (error) {
             if (error && error.message){
                vm.errorMessage = error.message;
            } else {
                vm.errorMessage = "Internal Server Error.";
            }
            $(window).scrollTop(0);
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

    vm.deleteImage = function(){
        Image.deleteImage(vm.currentImageInformation.filename)
        .success(function (response){
            vm.imageInfo.splice(
                vm.currentImageInformation.index, 1);
        })
        .error (function (error) {
             if (error && error.message){
                vm.errorMessage = error.message;
            } else {
                vm.errorMessage = "Internal Server Error.";
            }
            $(window).scrollTop(0);
        });
    };

    vm.deleteBlog = function(){
        Blog.deleteBlog(vm.currentBlogInformation.key)
        .success(function (response){
            vm.blogs.splice(
                vm.currentBlogInformation.index, 1);
        })
        .error (function (error) {
             if (error && error.message){
                vm.errorMessage = error.message;
            } else {
                vm.errorMessage = "Internal Server Error.";
            }
            $(window).scrollTop(0);
        });
    }

    vm.editBlog = function (blog) {
        //Populate the inputs with blog information
        vm.input.title = blog.title;
        vm.input.author = blog.author;
        vm.input.date = blog.date;
        vm.input.key = blog.key;
        vm.input.image = blog.image;
        vm.input.titleTag = blog.titleTag;
        vm.input.metaTag = blog.metaTag;
        vm.input.content = blog.content;

        //Show Post Blog Screen
        vm.view = "postBlog";
        vm.blogAction = "edit";
    };

    vm.updateBlog = function(){
        vm.errorMessage = "";
        if(!vm.input.image) {
            vm.errorMessage = "Title Image is missing.";
            return;
        }
        //add order indices for paragraphs
/*        for(i = 0; i < vm.input.paragraphs.length; i++){
            vm.input.paragraphs[i].index = i;
        }*/
        
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
            if (error && error.message){
                vm.errorMessage = error.message;
            } else {
                vm.errorMessage = "Internal Server Error.";
            }
            $(window).scrollTop(0);
        });
    };

    //Post New Blog
    vm.postBlog = function (){
         vm.errorMessage = "";
        if(!vm.input.image) {
            vm.errorMessage = "Title Image is missing.";
            return;
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
             if (error && error.message){
                vm.errorMessage = error.message;
            } else {
                vm.errorMessage = "Internal Server Error.";
            }
            $(window).scrollTop(0);
        });
    };

    //Cancel Blog Form and Clear It
    vm.cancelBlog = function () {
        setupInputFormDefaultData();
     };

    function setupInputFormDefaultData(){
        vm.input = {};
        vm.input.date = getCurrentDate();
        vm.input.author = "Passive Investor";
        vm.blogAction = "new";
        vm.errorMessage = "";
        vm.input.blogBlobs = [];
        vm.imageInfo = [];
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