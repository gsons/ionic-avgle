var app = angular.module('app', ['ionic', 'ngStorage','ionicLazyLoad']);

app.config(function($ionicConfigProvider, $sceDelegateProvider) {
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
})

app.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
})
app.factory('AuthInterceptor', function($rootScope, $q, $location, $timeout, $window) {
    return {
        response: function(response, toState) {
            var path = $location.path();
            var header = response.headers();
            return response;
        }
    };
})
app.run(function($ionicViewSwitcher,$window, $rootScope, $state, $stateParams, $localStorage, $http, $q, $location) {
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
})