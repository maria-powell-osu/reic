App.controller("AboutController", function ($scope, $sce, SlideShow) {
	var vm = this;
	/*
	 * Desc:  Let's us load youtube URL and avoid error below
	 * Error: Blocked loading resource from url not 
	 * 		  allowed by $sceDelegate policy
	 */
	vm.trustSrc = function(src) {
    	return $sce.trustAsResourceUrl(src);
  	};
  	vm.slideShow = {};
  	vm.slideShow.currSlideIndex = 0;
    vm.slideShow.slides = 
	[{
	    src: '/reic/app/assets/img/portland_skyline_banner_dark.jpg',
	    title: 'What is passive income?',
	    type: 'img',
	    index: 0,
	    visible: false
	  },
	  {
	    src: '/reic/app/assets/img/portland_skyline_banner.jpg',
	    title: 'What is passive income?',
	    type: 'img',
	    index: 1,
	    visible: false
	  },
	  
	  {  	
	  	/*orig url: https://m.youtube.com/watch?v=nqwziYu-Fb8*/
		src: 'https://www.youtube.com/embed/nqwziYu-Fb8',
	    title: '10 Ways to Earn Passive',
	    type: 'video',
	    index: 3,
	    visible: false
	  }, 
	  {
	  	/*orig url: https://m.youtube.com/watch?v=nyja-RbIEHA*/
	    src: 'https://www.youtube.com/embed/nyja-RbIEHA',
	    title: 'Personal Capital Cash Flow and Budgeting Tools',
	    type: 'video',
	    index: 2,
	    visible: false
	}];
	SlideShow.setData(vm.slideShow);
});

