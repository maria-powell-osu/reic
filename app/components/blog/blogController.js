App.controller("BlogController", function($scope, Comments) {
	var vm = this;

    vm.replyActive = false;
    vm.wantsNewsletter = true;
    Comments.getComments()
        .success(function (comments) {
            vm.comments = comments;
        })
        .error (function (error) {
            var test = error;
        });

    var today = new Date().toDateString();

    /*vm.comments = [
      {
        name:  "Maria", 
        email: "maria.powell.osu@gmail.com", 
        text:  "If the chart makes it hard to understand an important relationship between variables, do the extra calculation and visualize that as well. This includes using pie charts with wedges that are too similar to each other, or bubble charts with bubbles that are too similar to each other.  Our visual processing system is not well suited to comparing these types of visual areas. We are also not good at holding precise visual imagery in our memory and comparing it to new stimuli; if you are giving a presentation and want the audience to be able to compare two charts, they need to be on the same slide.",
        date:  today
      },
      {
        name:  "Maria", 
        email: "maria.powell.osu@gmail.com", 
        text:  "If the chart makes it hard to understand an important relationship between variables, do the extra calculation and visualize that as well. This includes using pie charts with wedges that are too similar to each other, or bubble charts with bubbles that are too similar to each other.  Our visual processing system is not well suited to comparing these types of visual areas. We are also not good at holding precise visual imagery in our memory and comparing it to new stimuli; if you are giving a presentation and want the audience to be able to compare two charts, they need to be on the same slide.",
        date:  today
      }
    ];*/



    vm.reply = function () {
    	vm.replyActive = true;
    };

    vm.cancelComment = function () {
    	vm.replyActive = false;
    };
});
