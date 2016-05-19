App.controller("BlogController", function($scope) {
	var vm = this;

    vm.replyActive = false;

    vm.reply = function () {
    	vm.replyActive = true;
    };

    vm.cancelComment = function () {
    	vm.replyActive = false;
    };
});
