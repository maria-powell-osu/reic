App.factory('SEO',  ['$window', function($window){
	var titleTag = '',
		metaTag = '';
	return {
		set: function (metaTag, titleTag){
			//find tag with name description.. <meta name="descriptipn"		
   			$window.document.getElementsByName('description')[0].content = metaTag;
   			
   			//Find the title tag	
   			$window.document.title = titleTag;
		}
	}
}]);