app.directive('ionImg', function() {
    return {
        scope: {
            ngsrc: '@',
            ngopt: '@',
        },
        link: function($scope, $dom) {
            var src = $scope.ngsrc;
            var ngopt = $scope.ngopt;
            var dom_image = angular.element($dom)[0];
            var img_src_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAIAAAADwcZiAAAAW0lEQVRYCe3SMQ7AMAzDwLb//6k/UWTnyGQJPWqQgIPfmXmO33d8cQ22ups94YQ9gb7Js+SmhNnFSxP2LLkpYXbx0oQ9S25KmF28NGHPkpsSZhcvTdiz5KabhH9OFAMPqToRyQAAAABJRU5ErkJggg==";
            dom_image.src = img_src_default;
            if (ngopt) {
                var ngopt = ngopt.split(',');
                var offset = ngopt[0];
                var scale = ngopt[1];
                dom_image.width = screen.width + parseInt(offset);
                dom_image.height = dom_image.width * scale;
            }
            var image = new Image();
            image.src = src;
            image.onload = function() {
                dom_image.src = src;
            }
        },
    };
});

/**
 *rjHoldActive指令
 *产生一种数据动态涟漪效果
 */
app.directive('rjHoldActive', function($timeout) {
    return {
        restrict: 'AE',
        replace: false,
        link: function(scope, element, iAttrs, controller) {
            element.bind("click", function(event) {
                var ele = document.getElementById("ripple");
                if (ele.classList) ele.classList.add("animate");
                else ele.className += " animate";
                ele.style.left = (event.pageX - 20) + "px";
                ele.style.top = (event.pageY - 20) + "px";
                $timeout(function() {
                    ele.style.left = "-40px";
                    ele.style.top = "-40px";
                    if (ele.classList) ele.classList.remove("animate");
                    else ele.className = ele.className.replace('animate', '');

                }, 200);
            });
        }
    };
});

app.directive('ionMovie', function($confirm, $state, $localStorage, Toast, $ionicViewSwitcher, $ionicListDelegate, $rootScope) {
    return {
        restrict: 'AE',
        replace: false,
        scope: false,
        priority: 1001,
        templateUrl: "tpl/movie.component.html",
        // template:'<ion-item  class="item-thumbnail-left" ng-click="view(vo)"><img image-lazy-src="{{vo.preview_url}}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAIAAAADwcZiAAAAW0lEQVRYCe3SMQ7AMAzDwLb//6k/UWTnyGQJPWqQgIPfmXmO33d8cQ22ups94YQ9gb7Js+SmhNnFSxP2LLkpYXbx0oQ9S25KmF28NGHPkpsSZhcvTdiz5KabhH9OFAMPqToRyQAAAABJRU5ErkJggg=="><h3 style="white-space: initial;max-height: 62px;line-height:20px;">{{vo.title}}</h3><p><button class="button-assertive button button-small btn-keyword" ng-click="$event.stopPropagation()" ui-sref="search({key:vo.keyword})">{{vo.keyword}}</button></p><ion-option-button class="button-calm" ng-click="save(vo)">收藏</ion-option-button></ion-item>',
        link: function(scope, element, attrs, controller) {
            scope.btnOption=scope.btnOption||1;
            scope.viewOption=scope.viewOption||1;
            scope.view=function(video){
               if(scope.viewOption==1){
                   scope.view1(video);
               }
               else if(scope.viewOption==2){
                   scope.view2(video);
               }
            }
            scope.view1 = function(video) {
                $localStorage.video = video;
                $state.go("view");
                $ionicViewSwitcher.nextDirection("forward");
            }

            scope.save = function(vo) {
                var list = $localStorage.saveList || [];
                var flag = false;
                for (var i in list) {
                    if (list[i].vid == vo.vid) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) list.unshift(vo);
                else {
                    Toast.show("您已经收藏了该电影");
                }
                $localStorage.saveList = list;
                $ionicListDelegate.closeOptionButtons();
            }

            scope.view2 = function(video) {
                $localStorage.video = video;
                $state.go("view", {}, { reload: true })
            }

            scope.delete = function(vo) {
                var index=scope.videos.indexOf(vo);
                $confirm.show({ title: "确定要删除吗" }, function() {
                    scope.videos.splice(index, 1);
                    $localStorage.saveList = scope.videos;
                    $ionicListDelegate.closeOptionButtons();
                }, function() { $ionicListDelegate.closeOptionButtons(); });
            }
            scope.preview=function(vo){
                window.open(vo.preview_video_url);  
                $ionicListDelegate.closeOptionButtons();           
            }
        }
    };
});

app.directive('labelKeyword', ['$compile', function($compile) {
    return {
        restrict: 'AE',
        replace: false,
        priority: 1001,
        scope: {
            keywords: '@',
        },
        template: '<button ng-repeat="vo in keywordArr" class="button-assertive button button-small btn-keyword" ng-click="$event.stopPropagation()" ui-sref="search({key:vo})">{{vo}}</button>',
        link: function(scope, element, attrs, controller) {
            scope.keywordArr=[];
            var keywordArr = scope.keywords.split(' ');
            for(var i in keywordArr){
                 if(scope.keywordArr.indexOf(keywordArr[i])==-1){
                    scope.keywordArr.push(keywordArr[i]);
                 }
            }
        }
    };
}]);

app.directive('btnScrollTop',function($timeout,$ionicScrollDelegate,$timeout) {
        return {
            restrict: 'AE',
            replace: false,
            scope: false,
            priority: 1001,
            template:'<div class="button-top ng-hide" ng-show="isBtnTop" ng-click="scrollTop($event)"><i class="icon ion-arrow-up-a"></i></div>',
            link: function(scope, element, iAttrs, controller) {
                scope.isBtnTop=false;
                scope.scroll=function(){
                     var content=$ionicScrollDelegate.$getByHandle(scope.handle);
                     var pos=content.getScrollPosition();
                     if(pos.top>600){
                          $timeout(function(){scope.isBtnTop=true},300);
                       }else{
                          $timeout(function(){scope.isBtnTop=false},300);
                     }
                }
                scope.scrollTop=function($event){
                    var ele=$event.target;
                    if(ele.classList) ele.classList.add("activated");
                    else ele.className +=" activated";
                    $timeout(function(){
                        if(ele.classList) ele.classList.remove("activated"); 
                        else ele.className=ele.className.replace('activated','');
                    },300);
                    $ionicScrollDelegate.$getByHandle(scope.handle).scrollTop(true);
                }
            }
        };
})