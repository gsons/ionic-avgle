app.controller('homeCtrl', function($scope,videoApi, $ionicScrollDelegate) {
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

    })



