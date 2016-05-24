App.directive('mpSlideShow', function($timeout, SlideShow) {
	return {
		link: function (scope, element, attrs) {
      //timeout to make sure digest ends before calling scope.apply again
      $timeout(function() {
        //to make sure bindings get applied
        scope.$apply( function () {
          var vm = this;
          var slideShow = SlideShow.getData();
          
          vm.slideShow = {};
          vm.slideShow.slides = slideShow.slides;
          vm.slideShow.currSlideIndex = slideShow.currSlideIndex; 

          //Current Slide should be visible
          vm.slideShow.slides[vm.slideShow.currSlideIndex].visible = true;

          SlideShow.setData(vm.slideShow);

          element.bind("click", function (event) {
            //timeout to make sure digest ends before calling scope.apply again
            $timeout(function() {
              //to make sure bindings get applied
              scope.$apply( function () {
                if(event.target.id === "arrowNext"){
                  var vm = this;
                  var slideShow = SlideShow.getData();
                  
                  vm.slideShow = {};
                  vm.slideShow.slides = slideShow.slides;
                  vm.slideShow.currSlideIndex = slideShow.currSlideIndex; 
                  
                  //Make the current slide invisble
                  vm.slideShow.slides[vm.slideShow.currSlideIndex].visible = false;

                  //Set up new slide index
                  if(vm.slideShow.currSlideIndex < vm.slideShow.slides.length - 1){
                    vm.slideShow.currSlideIndex++;
                  } else {
                    //if its the last slide, go to the first slide
                    vm.slideShow.currSlideIndex = 0;
                  }

                  //Make new slide visible
                  vm.slideShow.slides[vm.slideShow.currSlideIndex].visible = true;
                  
                  //Save New Data
                  SlideShow.setData(vm.slideShow);
                } else if (event.target.id === "arrowPrev"){
                  var vm = this;
                  var slideShow = SlideShow.getData();
                  
                  vm.slideShow = {};
                  vm.slideShow.slides = slideShow.slides;
                  vm.slideShow.currSlideIndex = slideShow.currSlideIndex; 

                  //Make the current slide invisble
                  vm.slideShow.slides[vm.slideShow.currSlideIndex].visible = false;

                  //Set up new slide index
                  if (vm.slideShow.currSlideIndex > 0) {
                    vm.slideShow.currSlideIndex--;
                  } else {
                    //if it is the first slide, go to the last slide
                   vm.slideShow.currSlideIndex = vm.slideShow.slides.length - 1;
                  }

                  //Make new slide visible
                  vm.slideShow.slides[vm.slideShow.currSlideIndex].visible = true;

                  //Save New Data
                  SlideShow.setData(vm.slideShow);
                }
              });
            });
          });
        });
      });
		}
	};
});

/*App.directive('arrowNext', function($timeout, SlideShow) {
  return {
    scope: {
      slideShow: '='
    },
    link: function (scope, element, attrs) {
      
    }
  };
});*/
