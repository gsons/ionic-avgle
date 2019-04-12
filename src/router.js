 app.config(function($stateProvider, $urlRouterProvider) {

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
 });