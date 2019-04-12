     app.factory('$loading', function($ionicLoading) {
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
     });
     app.factory("$confirm", function($ionicPopup) {
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
     });
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
     app.factory('Api', function($http,Toast,WAP_CONFIG, $q, $log, $ionicLoading, $timeout) {
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

     });
     
     app.factory('videoApi', function(Api, $q) {
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
     });

     app.factory("Toast", function($timeout, $ionicLoading) {
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
     });