App.controller('RadioController', ['$scope', function ($scope){
	//these values set up the default selection for radio buttons 
	 $scope.loanInfoView = 'bankLoan';
	 $scope.specialTermsInterestOption = '';
}]);

App.controller('FileController', ['$scope', function ($scope){
	 $scope.imageFileName = '';
	 $scope.imgUpload = {};
	 $scope.imgUpload.src = '';
}]);