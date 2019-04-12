app.controller("starCtrl", function($timeout,$ionicScrollDelegate, $scope,$localStorage) {
    function init() {
    	$scope.videos=$localStorage.saveList;
       
    }
    $scope.$on('$ionicView.enter', function(e) {
            init();
            console.log("star","$ionicView.enter");
      });
});