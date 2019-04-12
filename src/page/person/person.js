app.controller("personCtrl",function($state,$scope,$ionicViewSwitcher){
    $scope.$on('$ionicView.loaded', function() {
            console.log("person","$ionicView.loaded")
            // init();
        });
    $scope.goStar=function(){
    	$state.go("star");
    	$ionicViewSwitcher.nextDirection("forward");
    }
});