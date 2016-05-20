App.controller("BlogController", function($scope) {
	var vm = this;

    vm.replyActive = false;
    vm.wantsNewsletter = true;

    var today = new Date().toDateString();
    vm.comments = [
      {
        name:  "maria", 
        email: "maria.powell.osu@gmail.com", 
        text:  "This is the comment",
        date:  today
      }
    ];



    vm.reply = function () {
    	vm.replyActive = true;
    };

    vm.cancelComment = function () {
    	vm.replyActive = false;
    };
});
