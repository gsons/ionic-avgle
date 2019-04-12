app.controller('viewCtrl', function($timeout, Toast, $state, $localStorage, $scope, videoApi, $ionicScrollDelegate, $sce) {
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
})