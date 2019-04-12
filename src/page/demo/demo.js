app.controller("demoCtrl", function($ionicPopover,Api, $rootScope, $location, $ionicScrollDelegate, $loading, $scope, $http, $sessionStorage, $localStorage) {
    
    function init() {
        $scope.showItem = 0;
        // $scope.form_o='mr';$scope.form_t="a";$scope.form_type="any";
        // $scope.openPopover();
    }
    $scope.toggleShow = function(index) {
        if (index >= $scope.categories.length) return;
        $scope.showItem = index;
        var dom = document.getElementById("tab-cate-" + index);
        var left = dom.offsetLeft + dom.offsetWidth;
        var offset = left - document.body.clientWidth / 2;
        $ionicScrollDelegate.$getByHandle('slideScroll').scrollTo(offset, 0, true);
    }

    init();

    $ionicPopover.fromTemplateUrl('tpl/filter.popover.html', {
        scope: $scope
    }).then(function(popover) {
    $scope.popover = popover; $scope.popover.show();
    });
    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    $scope.surePopover=function(form_o,form_t,form_type){
        var query="";
        if(form_o) query+=('&o='+form_o);
        if(form_t) query+=('&t='+form_t);
        if(form_type) query+=('&type='+form_type);
        $scope.popover.hide();
    }

});