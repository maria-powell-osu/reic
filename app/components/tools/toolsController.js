App.controller("ToolsController", function($scope, SEO) {
	var vm = this,
        titleTag = "Investment Calculators | Plan Passive",
        metaTag = 'Use our suite of investment calculators to analyze your real estate deals, future value of your investments, or the cost of waiting to invest.';


    SEO.set(metaTag, titleTag);

});
