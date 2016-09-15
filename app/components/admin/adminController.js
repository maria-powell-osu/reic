App.controller("AdminController", function($scope, Blog, Admin) {
    var vm = this;
    setupInputFormDefaultData();
    vm.blog = {};
    vm.view = "addNewBlog";
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
            //Error Handling Needed ****************************
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

     vm.addParagraph = function() {
      vm.input.paragraphs.push({});
    };

    vm.deleteBlog = function(blogKey){
        Blog.deleteBlog(blogKey)
        .success(function (response){
            var test = response;
        })
        .error (function (error) {
            //Error Handling Needed ****************************
        });
    }

    vm.editBlog = function(){

    }

    //Post New Blog
    vm.submitNewBlog = function (){
        var jsonData = JSON.stringify(vm.input);
        
        Blog.postBlog(jsonData)
        .success(function (response){
            setupInputFormDefaultData();
            vm.blogPostedMessage = true;
        })
        .error (function (error) {
            //Error Handling Needed ****************************
        });
    };

    //Cancel Blog Form and Clear It
    vm.cancelBlog = function () {
        vm.input = {};
     };

    function setupInputFormDefaultData(){
        vm.input = {};
        vm.input.paragraphs = [{}];
        vm.input.date = getCurrentDate();
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