app.controller("searchCtrl", function($ionicPopover,$timeout,videoApi, $location, $ionicScrollDelegate, $scope) {
    $scope.searchVideo = function(_option,_keyword, _page) {
        videoApi.search(_option,_keyword,_page,15).then(function(data) {
            $scope.has_more = data.response.has_more;
            $scope.videos = $scope.videos.concat(data.response.videos);
            $scope.$broadcast('scroll.infiniteScrollComplete');
         });
    }

    $scope.submit = function(searchKey) {
        $scope.searchKey=searchKey;
        $scope.option={};
        $scope.page=0;
        $scope.videos=[];
        $ionicScrollDelegate.$getByHandle('searchScroll').scrollTop(true);
        $scope.searchVideo($scope.option,searchKey,$scope.page);
        $timeout(function(){document.getElementById("input_key").blur();},500);
    }

    $scope.loadNextPage = function(searchKey) {
        $scope.page++;
        $scope.searchVideo($scope.option,searchKey, $scope.page);
    }

    $scope.$on('$ionicView.enter', function(e) {
        init();
        console.log("search", "$ionicView.enter");
    });

    function init() {
        $scope.searchKey=$location.search().key;
        $scope.option={};
        $scope.videos=[];
        if($scope.searchKey){$scope.has_more=true;$scope.page=-1;}
        else {
            $timeout(function(){document.getElementById("input_key").focus();},500);
        }
    }  
    /*浮动框用于筛选*/
     $ionicPopover.fromTemplateUrl('tpl/filter.popover.html', {
         scope: $scope
     }).then(function(popover) {
         $scope.popover = popover;
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
     $scope.reset=function(){
         $scope.option={};
         $scope.page=0;
         $scope.videos=[];
         $scope.searchVideo($scope.option,$scope.searchKey,$scope.page);
         $ionicScrollDelegate.$getByHandle('listScroll').scrollTop();
         $scope.popover.hide();
     }
     $scope.surePopover = function(form_o, form_t, form_type) {
         var option={
            o:form_o,
            t:form_t,
            type:form_type,
         }
         $scope.page=0;
         $scope.videos=[];
         $scope.option=option;
         $scope.searchVideo($scope.option,$scope.searchKey,$scope.page);
         $ionicScrollDelegate.$getByHandle('listScroll').scrollTop();
         $scope.popover.hide();
     }
});