App.factory('SlideShow', function() {
	var SlideShow = {};
	return {
		getData: function(){
			return SlideShow;
		},
		setData: function (slideShow){
			SlideShow = slideShow;
		}
	}
});