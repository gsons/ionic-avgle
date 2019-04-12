 app.controller('listCtrl', function($ionicPopover, $scope, videoApi, $ionicScrollDelegate) {
     function init() {
         $scope.categoryId = "1";
         $scope.option={c:$scope.categoryId};
         $scope.videos = [];
         $scope.has_more = true;
         initCategories();
         $scope.isBtnTop = false;
         $scope.page=-1;
     }

     function initCategories() {
         videoApi.categories().then(function(data) {
             $scope.categories = data.response.categories;
             $scope.categoryId = "1";
             getCurrentCate();

         });
     }

     $scope.getVideoByCHID = function(option, page) {
         videoApi.videos(option, page).then(function(data) {
             $scope.$broadcast('scroll.infiniteScrollComplete');
             $scope.has_more = data.response.has_more;
             $scope.videos = $scope.videos.concat(data.response.videos);
         });
     }


     $scope.loadNextPage = function() {
         $scope.page++;
         $scope.getVideoByCHID($scope.option, $scope.page);
     }

     function getCurrentCate(){
        for(var i in $scope.categories){
            if($scope.categories[i].CHID==$scope.categoryId){
                $scope.currentCate=$scope.categories[i];
                $scope.cateImg="http://gsonhub.coding.me/avmoo/cates/"+$scope.currentCate.CHID+".jpg";
            }
         }
     }

     $scope.viewCate=function(){
        $scope.change($scope.categoryId);
     }
     $scope.change = function(categoryId) {
         $scope.page = 0;
         $scope.videos = [];
         $scope.categoryId=categoryId;
         getCurrentCate();
         $scope.option={c:categoryId};
         $scope.getVideoByCHID($scope.option,$scope.page);
         $ionicScrollDelegate.$getByHandle('listScroll').scrollTop();
     }
     $scope.$on('$ionicView.loaded', function() {
         console.log("list", "$ionicView.loaded")
         init();
     });
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
         $scope.option={c:$scope.categoryId};
         $scope.page=0;
         $scope.videos=[];
         $scope.getVideoByCHID($scope.option,$scope.page);
         $ionicScrollDelegate.$getByHandle('listScroll').scrollTop();
         $scope.popover.hide();
     }
     $scope.surePopover = function(form_o, form_t, form_type) {
         var option={
            o:form_o,
            t:form_t,
            type:form_type,
            c:$scope.categoryId,
         }
         $scope.page=0;
         $scope.videos=[];
         $scope.option=option;
         $scope.getVideoByCHID($scope.option,$scope.page);
         $ionicScrollDelegate.$getByHandle('listScroll').scrollTop();
         $scope.popover.hide();
     }
 });