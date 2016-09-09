App.controller("AdminController", function($scope) {
    $scope.options = {
        'onsuccess': function(response) {
            alert('here');
        }
    }
});