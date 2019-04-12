var app = angular.module('app', ['ionic', 'ngStorage','ionicLazyLoad']);

app.config(['$ionicConfigProvider', '$sceDelegateProvider', function($ionicConfigProvider, $sceDelegateProvider) {
    //$sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.spinner.icon("ios");
    $ionicConfigProvider.platform.android.tabs.position('standard');
    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('bottom');
    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');
}])

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
}])
app.factory('AuthInterceptor', ['$rootScope', '$q', '$location', '$timeout', '$window', function($rootScope, $q, $location, $timeout, $window) {
    return {
        response: function(response, toState) {
            var path = $location.path();
            var header = response.headers();
            return response;
        }
    };
}])
app.run(['$ionicViewSwitcher', '$window', '$rootScope', '$state', '$stateParams', '$localStorage', '$http', '$q', '$location', function($ionicViewSwitcher,$window, $rootScope, $state, $stateParams, $localStorage, $http, $q, $location) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$goback = function() {
        $window.history.back();
        $ionicViewSwitcher.nextDirection("back");
    }
    $rootScope.$refresh = function() {
        $window.location.reload();
        // $state.reload();
    }
    $rootScope.$search = function() {
        $state.go("search");
        $ionicViewSwitcher.nextDirection("forward");   
    }
    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams, toState) {
        $rootScope.previousState = from;
        $rootScope.previousStateParams = fromParams;
    });

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        // ionic.Platform.setPlatform('ios');
    })
}])
app.constant('WAP_CONFIG', {
        host: 'https://api.avgle.com',
        port: 443,
        path: '/v1/',
        platform: 'browser' // 
    })
 app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

     $stateProvider
         .state('app', {
             url: '/app',
             templateUrl: 'tpl/app.html?v=' + $tplVersion,
             abstract: true
         })

         .state('app.home', {
             url: '/home',
             views: {
                 'tab-home': {
                     templateUrl: 'tpl/home.html?v=' + $tplVersion,
                     controller: 'homeCtrl',
                     cache:true
                 }
             }
         })

         .state('app.list', {
             url: '/list',
             views: {
                 'tab-list': {
                     templateUrl: 'tpl/list.html?v=' + $tplVersion,
                     controller: 'listCtrl',
                     cache:true
                 }
             }
         })
         
         .state('app.person', {
             url: '/person',
             views: {
                 'tab-person': {
                     templateUrl: 'tpl/person.html?v=' + $tplVersion,
                     controller: 'personCtrl',
                     cache:true
                 }
             }
         })

         .state('view', {
             url: '/view',
             templateUrl: 'tpl/view.html?v=' + $tplVersion,
             controller: 'viewCtrl',
             cache:true
         })

         .state('star', {
             url: '/star',
             templateUrl: 'tpl/star.html?v=' + $tplVersion,
             controller: 'starCtrl',
             cache:true
         })

          .state('demo', {
             url: '/demo',
             templateUrl: 'tpl/demo.html?v=' + $tplVersion,
             controller: 'demoCtrl',
             cache:true
         })
         .state('search', {
             url: '/search?key',
             templateUrl: 'tpl/search.html?v=' + $tplVersion,
             controller: 'searchCtrl',
             cache:false
         })



     $urlRouterProvider.otherwise('/app/home');
 }]);
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
app.directive('rjHoldActive', ['$timeout', function($timeout) {
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
}]);

app.directive('ionMovie', ['$confirm', '$state', '$localStorage', 'Toast', '$ionicViewSwitcher', '$ionicListDelegate', '$rootScope', function($confirm, $state, $localStorage, Toast, $ionicViewSwitcher, $ionicListDelegate, $rootScope) {
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
}]);

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

app.directive('btnScrollTop',['$timeout', '$ionicScrollDelegate', '$timeout', function($timeout,$ionicScrollDelegate,$timeout) {
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
}])
/**
 * Created by PAVEI on 30/09/2014.
 * Updated by Ross Martin on 12/05/2014
 * Updated by Davide Pastore on 04/14/2015
 * Updated by Michel Vidailhet on 05/12/2015
 * Updated by Rene Korss on 11/25/2015
 */

angular.module('ionicLazyLoad', []);

angular.module('ionicLazyLoad')

.directive('lazyScroll', ['$rootScope',
    function($rootScope) {
        return {
            restrict: 'A',
            link: function ($scope) {
                var origEvent = $scope.$onScroll;
                $scope.$onScroll = function () {
                    $rootScope.$broadcast('lazyScrollEvent');

                    if(typeof origEvent === 'function'){
                      origEvent();
                    }
                };
            }
        };
}])

.directive('imageLazySrc', ['$document', '$timeout', '$ionicScrollDelegate', '$compile',
    function ($document, $timeout, $ionicScrollDelegate, $compile) {
        return {
            restrict: 'A',
            scope: {
                lazyScrollResize: "@lazyScrollResize",
                imageLazyBackgroundImage: "@imageLazyBackgroundImage",
                imageLazySrc: "@"
            },
            link: function ($scope, $element, $attributes) {
                if (!$attributes.imageLazyDistanceFromBottomToLoad) {
                    $attributes.imageLazyDistanceFromBottomToLoad = 0;
                }
                if (!$attributes.imageLazyDistanceFromRightToLoad) {
                    $attributes.imageLazyDistanceFromRightToLoad = 0;
                }

                var loader;
                if ($attributes.imageLazyLoader) {
                    loader = $compile('<div class="image-loader-container"><ion-spinner class="image-loader" icon="' + $attributes.imageLazyLoader + '"></ion-spinner></div>')($scope);
                    $element.after(loader);
                }

                $scope.$watch('imageLazySrc', function (oldV, newV) {
                    if(loader)
                        loader.remove();
                    if ($attributes.imageLazyLoader) {
                        loader = $compile('<div class="image-loader-container"><ion-spinner class="image-loader" icon="' + $attributes.imageLazyLoader + '"></ion-spinner></div>')($scope);
                        $element.after(loader);
                    }
                    var deregistration = $scope.$on('lazyScrollEvent', function () {
                        //    console.log('scroll');
                            if (isInView()) {
                                loadImage();
                                deregistration();
                            }
                        }
                    );
                    $timeout(function () {
                        if (isInView()) {
                            loadImage();
                            deregistration();
                        }
                    }, 500);
                });
                var deregistration = $scope.$on('lazyScrollEvent', function () {
                       // console.log('scroll');
                        if (isInView()) {
                            loadImage();
                            deregistration();
                        }
                    }
                );

                function loadImage() {
                    //Bind "load" event
                    $element.bind("load", function (e) {
                        if ($attributes.imageLazyLoader) {
                            loader.remove();
                        }
                        if ($scope.lazyScrollResize == "true") {
                            //Call the resize to recalculate the size of the screen
                            $ionicScrollDelegate.resize();
                        }
                        $element.unbind("load");
                    });
                    $element.bind("error", function (e) {
                        this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAIAAAADwcZiAAAAW0lEQVRYCe3SMQ7AMAzDwLb//6k/UWTnyGQJPWqQgIPfmXmO33d8cQ22ups94YQ9gb7Js+SmhNnFSxP2LLkpYXbx0oQ9S25KmF28NGHPkpsSZhcvTdiz5KabhH9OFAMPqToRyQAAAABJRU5ErkJggg=='
                    });

                    if ($scope.imageLazyBackgroundImage == "true") {
                        var bgImg = new Image();
                        bgImg.onload = function () {
                            if ($attributes.imageLazyLoader) {
                                loader.remove();
                            }
                            $element[0].style.backgroundImage = 'url(' + $attributes.imageLazySrc + ')'; // set style attribute on element (it will load image)
                            if ($scope.lazyScrollResize == "true") {
                                //Call the resize to recalculate the size of the screen
                                $ionicScrollDelegate.resize();
                            }
                        };
                        bgImg.src = $attributes.imageLazySrc;
                    } else {
                        $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)
                    }
                }

                function isInView() {
                    var clientHeight = $document[0].documentElement.clientHeight;
                    var clientWidth = $document[0].documentElement.clientWidth;
                    var imageRect = $element[0].getBoundingClientRect();
                    return (imageRect.top >= 0 && imageRect.top <= clientHeight + parseInt($attributes.imageLazyDistanceFromBottomToLoad))
                        && (imageRect.left >= 0 && imageRect.left <= clientWidth + parseInt($attributes.imageLazyDistanceFromRightToLoad));
                }

                // bind listener
                // listenerRemover = scrollAndResizeListener.bindListener(isInView);

                // unbind event listeners if element was destroyed
                // it happens when you change view, etc
                $element.on('$destroy', function () {
                    deregistration();
                });

                // explicitly call scroll listener (because, some images are in viewport already and we haven't scrolled yet)
                $timeout(function () {
                    if (isInView()) {
                        loadImage();
                        deregistration();
                    }
                }, 500);
            }
        };
    }]);

'use strict';

(function() {

    /**
     * @ngdoc overview
     * @name ngStorage
     */

    angular.module('ngStorage', []).

    /**
     * @ngdoc object
     * @name ngStorage.$localStorage
     * @requires $rootScope
     * @requires $window
     */

    factory('$localStorage', _storageFactory('localStorage')).

    /**
     * @ngdoc object
     * @name ngStorage.$sessionStorage
     * @requires $rootScope
     * @requires $window
     */

    factory('$sessionStorage', _storageFactory('sessionStorage'));

    function _storageFactory(storageType) {
        return [
            '$rootScope',
            '$window',

            function(
                $rootScope,
                $window
            ){
                // #9: Assign a placeholder object if Web Storage is unavailable to prevent breaking the entire AngularJS app
                var webStorage = $window[storageType] || (console.warn('This browser does not support Web Storage!'), {}),
                    $storage = {
                        $default: function(items) {
                            for (var k in items) {
                                angular.isDefined($storage[k]) || ($storage[k] = items[k]);
                            }

                            return $storage;
                        },
                        $reset: function(items) {
                            for (var k in $storage) {
                                '$' === k[0] || delete $storage[k];
                            }

                            return $storage.$default(items);
                        }
                    },
                    _last$storage,
                    _debounce;

                for (var i = 0, k; i < webStorage.length; i++) {
                    // #8, #10: `webStorage.key(i)` may be an empty string (or throw an exception in IE9 if `webStorage` is empty)
                    (k = webStorage.key(i)) && 'ngStorage-' === k.slice(0, 10) && ($storage[k.slice(10)] = angular.fromJson(webStorage.getItem(k)));
                }

                _last$storage = angular.copy($storage);

                $rootScope.$watch(function() {
                    _debounce || (_debounce = setTimeout(function() {
                        _debounce = null;

                        if (!angular.equals($storage, _last$storage)) {
                            angular.forEach($storage, function(v, k) {
                                angular.isDefined(v) && '$' !== k[0] && webStorage.setItem('ngStorage-' + k, angular.toJson(v));

                                delete _last$storage[k];
                            });

                            for (var k in _last$storage) {
                                webStorage.removeItem('ngStorage-' + k);
                            }

                            _last$storage = angular.copy($storage);
                        }
                    }, 100));
                });

                // #6: Use `$window.addEventListener` instead of `angular.element` to avoid the jQuery-specific `event.originalEvent`
                'localStorage' === storageType && $window.addEventListener && $window.addEventListener('storage', function(event) {
                    if ('ngStorage-' === event.key.slice(0, 10)) {
                        event.newValue ? $storage[event.key.slice(10)] = angular.fromJson(event.newValue) : delete $storage[event.key.slice(10)];

                        _last$storage = angular.copy($storage);

                        $rootScope.$apply();
                    }
                });

                return $storage;
            }
        ];
    }

})();

     app.factory('$loading', ['$ionicLoading', function($ionicLoading) {
         return {
             show: function(_showBackdrop, _content, _icon, _class) {
                 var showBackdrop = _showBackdrop || false;
                 var icon = _icon || 'ios';
                 var mclass = _class || '';
                 var content = _content || "";
                 var style = showBackdrop ? "<style>.loading-container .loading{background-color: rgba(0, 0, 0,0.6);}</style>" :
                     "<style>.loading-container .loading{background-color: rgba(0, 0, 0,0.2);}</style>";
                 $ionicLoading.show({
                     template: style + '<ion-spinner icon="' + icon + '" class="' + mclass + '"></ion-spinner><div>' + content + '</div>',
                     content: 'Loading',
                     animation: '',
                     showBackdrop: showBackdrop,
                     minWidth: 500,
                     showDelay: 0
                 });
             },
             hide: function() {
                 $ionicLoading.hide();
             }
         }
     }]);
     app.factory("$confirm", ['$ionicPopup', function($ionicPopup) {
         return {
             show: function(_option, _callback, _callback_cancle) {
                 var title = _option.title || '提示';
                 var content = _option.content || '';
                 var callback = _callback || function() {};
                 var callback_cancle = _callback_cancle || function() {};
                 var popup = $ionicPopup.confirm({
                     template: content,
                     title: title,
                     buttons: [{
                         text: '确定',
                         type: 'button-positive',
                         onTap: function(e) {
                             return 1;
                         }
                     }, {
                         text: '取消',
                         type: 'button-assertive',
                     }]
                 });
                 popup.then(function(res) {
                     if (res) {
                         callback();
                     } else {
                         callback_cancle();
                     }
                 })
             },
         }
     }]);
     app.filter('Datetranslater', function() {

         return function(_time) {
             var time = _time;
             var date = new Date(time);
             var nowtime = new Date().getTime();
             //当天
             if (date.toDateString() === new Date().toDateString()) {
                 return formatDate(date, 'HH:mm');
             }
             //六天以内
             else if (nowtime - time < 6 * 24 * 60 * 60 * 1000) {
                 return formatDate(date, 'w HH:mm');
             }
             //本月
             else if (date.getMonth() == new Date().getMonth() && date.getFullYear() == new Date().getFullYear()) {
                 return formatDate(date, 'MM-dd HH:mm');
             } else if (date.getFullYear() == new Date().getFullYear()) {
                 return formatDate(date, 'yyyy-MM-dd HH:mm');
             } else {
                 return formatDate(date, 'yyyy-MM-dd HH:mm');
             }

         }

         function formatDate(date, fmt) {
             date = date == undefined ? new Date() : date;
             date = typeof date == 'number' ? new Date(date) : date;
             fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
             var obj = {
                 'y': date.getFullYear(), // 年份，注意必须用getFullYear
                 'M': date.getMonth() + 1, // 月份，注意是从0-11
                 'd': date.getDate(), // 日期
                 'q': Math.floor((date.getMonth() + 3) / 3), // 季度
                 'w': date.getDay(), // 星期，注意是0-6
                 'H': date.getHours(), // 24小时制
                 'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
                 'm': date.getMinutes(), // 分钟
                 's': date.getSeconds(), // 秒
                 'S': date.getMilliseconds() // 毫秒
             };
             var week = ['日', '一', '二', '三', '四', '五', '六'];
             for (var i in obj) {
                 fmt = fmt.replace(new RegExp(i + '+', 'g'), function(m) {
                     var val = obj[i] + '';
                     if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
                     for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
                     return m.length == 1 ? val : val.substring(val.length - m.length);
                 });
             }
             return fmt;
         }


     });
     app.factory('Api', ['$http', 'Toast', 'WAP_CONFIG', '$q', '$log', '$ionicLoading', '$timeout', function($http,Toast,WAP_CONFIG, $q, $log, $ionicLoading, $timeout) {
         var _api = WAP_CONFIG;
         var endpoint = _api.host + ':' + _api.port + _api.path;

         // public api  
         return {
             //发送服务器的域名+端口， 
             endpoint: endpoint,

             //post请求，第一个参数是URL，第二个参数是向服务器发送的参数（JSON对象），  
             post: function(url, data) {
                 url = endpoint + url;
                 var _timeout = 5000;
                 var deferred = $q.defer();
                 var tempPromise;
                 //显示加载进度  
                 $ionicLoading.show({
                     template: '加载中...'
                 });
                 //判断用户是否传递了参数，如果有参数需要传递参数  
                 if (data != null && data != undefined && data != "") {
                     tempPromise = $http.post(url, data, { timeout: _timeout });
                 } else {
                     tempPromise = $http.post(url, { timeout: _timeout });
                 }
                 tempPromise.success(function(data, header, config, status) {
                     deferred.resolve(data);
                     $ionicLoading.hide();
                 }).error(function(msg, code) {
                     deferred.reject(msg);
                     $log.error(msg, code);
                     $ionicLoading.hide();
                     var errorTitle;
                     if(code=='-1') errorTitle="请求超时,请检查你的网络连接情况";
                     else if(code=="400") errorTitle="错误的请求";
                     else if(code=="404") errorTitle="404 Not Found";
                     else if(code=="500"||code=="502") errorTitle="出错了,请稍后再试";
                     else if(code=="503") errorTitle="您的操作太频繁了,休息一下再试吧";
                     else errorTitle="发生了未知错误,请稍后再试";
                     Toast.show(errorTitle,"error");
                 });
                 return deferred.promise;
             },

             //get请求，第一个参数是URL，第二个参数是向服务器发送的参数（JSON对象），  
             get: function(url, data) {
                 url = endpoint + url;
                 var deferred = $q.defer();
                 var tempPromise;
                 var _timeout = 5000;
                 //显示加载进度  
                 $ionicLoading.show({
                     template: '加载中...'
                 });
                 //判断用户是否传递了参数如果有参数需要传递参数  
                 if (data != null && data != undefined && data != "") {
                     tempPromise = $http.get(url, data, { timeout: _timeout });
                 } else {
                     tempPromise = $http.get(url, { timeout: _timeout });
                 }
                 tempPromise.success(function(data, header, config, status) {
                     deferred.resolve(data);
                     $ionicLoading.hide();
                 }).error(function(msg, code) {
                     deferred.reject(msg);
                     $log.error(msg, code);
                     $ionicLoading.hide();
                     var errorTitle;
                     if(code=='-1') errorTitle="请求超时,请检查你的网络连接情况";
                     else if(code=="400") errorTitle="错误的请求";
                     else if(code=="404") errorTitle="404 Not Found";
                     else if(code=="500"||code=="502") errorTitle="出错了,请稍后再试";
                     else if(code=="503") errorTitle="您的操作太频繁了,休息一下再试吧";
                     else errorTitle="发生了未知错误,请稍后再试";

                     Toast.show(errorTitle,"error");
                 });
                 return deferred.promise;
             }
         };

     }]);
     
     app.factory('videoApi', ['Api', '$q', function(Api, $q) {
         function getQuery(_option, _page) {
             var option = {
                 o: _option.o || 'mr',
                 t: _option.t || 'a',
                 type: _option.type || '',
                 c: _option.c || '',
                 limit: _option.limit || 15
             }
             var query = '?';
             for (var key in option) {
                 query += (key + '=' + option[key] + '&');
             }
             return query.substr(0, query.length - 1);
         }
         return {
             videos: function(_option, _page) {
                 var deferred = $q.defer();
                 var query = getQuery(_option, _page);
                 var page = _page || 0;
                 Api.get('videos/'+page+query).then(function(data) {
                     if (data.success) {
                         deferred.resolve(data);
                     } else {
                         deferred.reject(data);
                     }
                 }, function(data) {
                     deferred.reject(data);
                 });
                 return deferred.promise;
             },
             search: function(_option, _keyword, _page) {
                 var deferred = $q.defer();
                 var query = getQuery(_option, _page);
                 var page = _page || 0;
                 var keyword = _keyword || '';
                 keyword = encodeURIComponent(keyword);
                 Api.get('search/'+keyword+'/'+page+query).then(function(data) {
                     if (data.success) {
                         deferred.resolve(data);
                     } else {
                         deferred.reject(data);
                     }
                 }, function(data) {
                     deferred.reject(data);
                 });
                 return deferred.promise;
             },
             jav: function(_option, _keyword, _page) {
                 var deferred = $q.defer();
                 var query = getQuery(_option, _page);
                 var page = _page || 0;
                 var keyword = _keyword || '';
                 keyword = encodeURIComponent(keyword);
                 Api.get('jav/'+keyword+'/'+page+query).then(function(data) {
                     if (data.success) {
                         deferred.resolve(data);
                     } else {
                         deferred.reject(data);
                     }
                 }, function(data) {
                     deferred.reject(data);
                 });
                 return deferred.promise;
             },
             categories: function() {
                 var deferred = $q.defer();
                 Api.get('categories').then(function(data) {
                     if (data.success) {
                         deferred.resolve(data);
                     } else {
                         deferred.reject(data);
                     }
                 }, function(data) {
                     deferred.reject(data);
                 });
                 return deferred.promise;
             },
             video: function(vid) {
                 if(!vid) return;
                 var deferred = $q.defer();
                 Api.get('video/'+vid).then(function(data) {
                     if (data.success) {
                         deferred.resolve(data);
                     } else {
                         deferred.reject(data);
                     }
                 }, function(data) {
                     deferred.reject(data);
                 });
                 return deferred.promise;
             },
              collections: function(_page,_limit) {
                 var page=_page||0;
                 var limit=_limt||15;
                 var deferred = $q.defer();
                 Api.get('collections/'+page+"?limit="+limit).then(function(data) {
                     if (data.success) {
                         deferred.resolve(data);
                     } else {
                         deferred.reject(data);
                     }
                 }, function(data) {
                     deferred.reject(data);
                 });
                 return deferred.promise;
             }

         }
     }]);

     app.factory("Toast", ['$timeout', '$ionicLoading', function($timeout, $ionicLoading) {
         return {
             show: function(content, _status) {
                 var status = _status || 'info';
                 if (status == 'error') {
                     var _class = "icon ion-android-alert assertive";
                 } else if (status == "success") {
                     var _class = "icon ion-android-alert positive";
                 } else if (status == "info") {
                     var _class = "icon ion-android-alert calm";
                 }
                 $ionicLoading.show({
                     template: '<i class="' + _class + '">  ' + content + '</i>'
                 });
                 $timeout(function() { $ionicLoading.hide() }, 1500);
             }
         }
     }]);
app.controller("demoCtrl", ['$ionicPopover', 'Api', '$rootScope', '$location', '$ionicScrollDelegate', '$loading', '$scope', '$http', '$sessionStorage', '$localStorage', function($ionicPopover,Api, $rootScope, $location, $ionicScrollDelegate, $loading, $scope, $http, $sessionStorage, $localStorage) {
    
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

}]);
app.controller('homeCtrl', ['$scope', 'videoApi', '$ionicScrollDelegate', function($scope,videoApi, $ionicScrollDelegate) {
        function init() {
            $scope.page =-1;
            $scope.has_more = true;
            $scope.isBtnTop = false;
            $scope.videos = [];
            initSlideVideos();
        }

        function initSlideVideos() {
            videoApi.videos({o:'mr',limit:5},0).then(function(data){
                 $scope.slideVideos = data.response.videos;
            });
        }

        $scope.loadNextPage = function() {
            $scope.page++;
            videoApi.videos({o:'mv'},$scope.page).then(function(data){
                $scope.has_more = data.response.has_more;
                $scope.videos = $scope.videos.concat(data.response.videos);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        

        $scope.$on('$ionicView.loaded', function() {
            console.log("home","$ionicView.loaded")
            init();
        });

    }])




 app.controller('listCtrl', ['$ionicPopover', '$scope', 'videoApi', '$ionicScrollDelegate', function($ionicPopover, $scope, videoApi, $ionicScrollDelegate) {
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
                $scope.cateImg="https://gsons.github.io/shop/cates/"+$scope.currentCate.CHID+".jpg";
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
 }]);
app.controller("personCtrl",['$state', '$scope', '$ionicViewSwitcher', function($state,$scope,$ionicViewSwitcher){
    $scope.$on('$ionicView.loaded', function() {
            console.log("person","$ionicView.loaded")
            // init();
        });
    $scope.goStar=function(){
    	$state.go("star");
    	$ionicViewSwitcher.nextDirection("forward");
    }
}]);
app.controller("searchCtrl", ['$ionicPopover', '$timeout', 'videoApi', '$location', '$ionicScrollDelegate', '$scope', function($ionicPopover,$timeout,videoApi, $location, $ionicScrollDelegate, $scope) {
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
}]);
app.controller("starCtrl", ['$timeout', '$ionicScrollDelegate', '$scope', '$localStorage', function($timeout,$ionicScrollDelegate, $scope,$localStorage) {
    function init() {
    	$scope.videos=$localStorage.saveList;
       
    }
    $scope.$on('$ionicView.enter', function(e) {
            init();
            console.log("star","$ionicView.enter");
      });
}]);
app.controller('viewCtrl', ['$timeout', 'Toast', '$state', '$localStorage', '$scope', 'videoApi', '$ionicScrollDelegate', '$sce', function($timeout, Toast, $state, $localStorage, $scope, videoApi, $ionicScrollDelegate, $sce) {
    $scope.$on('$ionicView.enter', function(e) {
        init();
        console.log("view", "$ionicView.enter");
    });

    $scope.$on('$ionicView.beforeLeave', function(e) {
        $scope.video_src = undefined;
        console.log("view", "$ionicView.beforeLeave");
    });


    function init() {
        $scope.page = -1;
        $scope.isBtnTop = false;
        $scope.has_more = true;
        $scope.videos = [];
        $scope.video = $localStorage.video;
        $scope.video_src = $sce.trustAsResourceUrl($scope.video.embedded_url);
        var keywordArr=$scope.video.keyword.split(" ");
        $scope.keyword=keywordArr[0];
    }

    $scope.loadNextPage = function() {
        $scope.page++;
        videoApi.search({},$scope.keyword,$scope.page,15).then(function(data) {
            $scope.has_more = data.response.has_more;
            $scope.videos = $scope.videos.concat(data.response.videos);
            $scope.$broadcast('scroll.infiniteScrollComplete');
         });
    }
}])