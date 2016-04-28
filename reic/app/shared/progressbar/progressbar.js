App.directive('mpProgressbar', function ($timeout) {
  return {
    scope: {
      stepViews: '=stepViews',
    },
    link: function (scope, element, attrs) {
      //timeout to make sure digest ends before calling scope.apply again
      $timeout(function() {
        //to make sure bindings get applied
        scope.$apply( function () {
          $(element).bind("click", function (event) {
            var steps = scope.stepViews;
            var flag = false;
            for (var i = 0; i < steps.length; i++){
              //remove green coloring from steps after current
              if(flag){
                $('#' + steps[i].step).removeClass("active");
              }
              if(steps[i].step === event.target.id){
                //Show the view of the clicked on step
                $('#' + steps[i].view).show();
                $('#' + event.target.id).addClass("active");
                flag = true;
              }else{
                //Hide all other views
                $('#' +steps[i].view).hide();
              }

              
            }
            //Step through the list items
            //element.children().each( function ( index, item ) {
            //var test = event.target.id;

            //});
          });
        });
      });
    }
  };
});