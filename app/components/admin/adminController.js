App.controller("AdminController", function($scope, Blog, Admin) {
    var vm = this;
    vm.input = {};
    vm.blog = {};
    vm.input.date = getCurrentDate();
    vm.showBlogForm = false;
    vm.blogPostedMessage = false;
    vm.notification = "You are not signed in at the momement.";
    vm.buttonText = "Sign In";

    //Check User Credentials
    Admin.isAdmin()
        .success(function (response){
            if (response.isSignedIn){   
                vm.notification = "Have fun blogging.";
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

    //Post New Blog
    vm.submitNewBlog = function (){
        var jsonData = JSON.stringify(vm.input);
        Blog.postBlog(jsonData)
        .success(function (response){
            //Success Message and maybe add a link
            vm.blogPostedMessage = true;
            vm.input = {};

        })
        .error (function (error) {
            //Error Handling Needed ****************************
        });
    };

    //Cancel Blog Form and Clear It
    vm.cancelBlog = function () {
        vm.showBlogForm = false;
        vm.input = {};
    };

    //This gets called AFTER the user has signed into the google account
    /*$scope.options = {
        'onsuccess': function(googleUser) {
            var user = {};
            user.id_token = googleUser.getAuthResponse().id_token;
            //Check User Credentials
            Admin.isAdmin(JSON.stringify(user))
                .success(function (response){
                    alert("here");
                    var test = response;
                    vm.showBlogForm = true;
                })
                .error (function (error) {
                    //Error Handling Needed ****************************
                });

            //The scope needs to get updated in the view
            $scope.$apply();
        }
    }*/
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