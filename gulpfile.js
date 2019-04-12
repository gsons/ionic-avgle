var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var htmlmin = require('gulp-htmlmin');
var webserver = require('gulp-webserver');
var watch=require('gulp-watch');

/**
 * 
 * docotrs
 * 
 */
var $path="H:/www/Gsonhub.coding.me/avgle/";
gulp.task('scss', function(done) {
  console.log("---------------------- scss TASK");
  gulp.src($path+'src/**/*.scss')
    .pipe(concat('main.scss'))
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest($path+'/build/'))
    .on('end', done);
});

gulp.task('_scss', function(done) {
  console.log("---------------------- _scss TASK");
  gulp.src($path+'src/**/*.scss')
    .pipe(concat('main.scss'))
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest($path+'/build/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest($path+'/build/'))
    .on('end', done);
});


//没有压缩的js
gulp.task('script', function(done) {
  console.log("----------------------script TASK");
  gulp.src([$path+'/src/app.js',$path+'/src/config.js',$path+'/src/router.js',$path+'/src/directive/**/*.js',$path+'/src/service/**/*.js',$path+'/src/page/**/*.js'])
    .pipe(concat('main.js'))
    .pipe(ngAnnotate({ single_quotes: true }))
    .pipe(gulp.dest($path+'/build')).on('end', done);
});

//压缩过的js
gulp.task('_script', function(done) {
  console.log("----------------------_script TASK");
  gulp.src([$path+'/src/app.js',$path+'/src/config.js',$path+'/src/router.js',$path+'/src/directive/**/*.js',$path+'/src/service/**/*.js',$path+'/src/page/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(ngAnnotate({ single_quotes: true }))
    .pipe(gulp.dest($path+'/build'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest($path+'/build'))
    .pipe(sourcemaps.write(''))
    .on('end', done);
});

gulp.task('tpl', function(done) {
  console.log("---------------------- tpl TASK");
  gulp.src($path+'/src/page/**/*.html')
    .pipe(rename({dirname: ''})) 
    .pipe(gulp.dest($path+'/tpl'))
    .on('end', done);
});

gulp.task('_tpl', function(done) {
  console.log("---------------------- tpl TASK");
  var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes:false,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
  gulp.src($path+'/src/page/**/*.html')
    .pipe(rename({dirname: ''})) 
    .pipe(htmlmin(options)) 
    .pipe(gulp.dest($path+'/tpl'))
    .on('end', done);
});

// gulp 自带的watch
gulp.task('w', function() {
  console.log("----------------------w TASK");
  gulp.watch([$path+'/src/page/**/*.html'], ['tpl']);
  gulp.watch([$path+'/src/**/*.scss'], ['scss']);
  gulp.watch([$path+'/src/**/*.js'], ['script']);
});


gulp.task('_w', function() {
  console.log("---------------------- _w TASK");
  watch([$path+'/src/**/*.scss'],function(){
     gulp.run("scss");
  });
   watch([$path+'/src/page/**/*.html'],function(){
     gulp.run("tpl");
  });
  watch([$path+'/src/**/*.js'],function(){
     gulp.run("script");
  });

});


gulp.task('_ionic_scss', function(done) {
  console.log("---------------------- _ionic_scss TASK");
  gulp.src($path)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest($path+'/src/lib/ionic/css/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest($path+'/src/lib/ionic/css/'))
    .on('end', done);
});



gulp.task('page',function(){
  const fs = require('fs');
  function add(path,fileName, data) {
    if(!fs.existsSync(path)) fs.mkdirSync(path);
    fs.writeFileSync(path+''+fileName,data);
 }

 var pageName=process.argv.slice(2)[2];
 var dirPath=$path+'src/page/'+pageName+'/';
 var  obj={
    html:{
       path:dirPath,
       file:pageName+'.html',
       content:`<ion-header-bar class="bar-stable">
    <button ng-click="$back()" class="button back-button buttons button-clear  header-item" style=""><i class="icon ion-android-arrow-back"></i>
        <span class="back-text" style=""></span></button>
    <h1 class="title" align-title="center">${pageName}</h1>
    <button ng-click="$refresh()" class="button button-stable button-clear"><i class="icon ion-android-refresh"></i>
    </button>
</ion-header-bar>
<ion-content delegate-handle="handle-scroll">
</ion-content>`,
    },
    scss:{
      path:dirPath,
      file:pageName+'.scss',
      content:`.page-${pageName}{
  
}`
    },
    js:{
      path:dirPath,
      file:pageName+'.js',
      content:`app.controller("${pageName}Ctrl", function($rootScope,$location,$ionicScrollDelegate,$loading,$baseurl, $scope, $http,$sessionStorage,$localStorage) {
    function init() {

    }
    init();
});`
    }
 }
 add(obj.js.path,obj.js.file,obj.js.content);
 add(obj.scss.path,obj.scss.file,obj.scss.content);
 add(obj.html.path,obj.html.file,obj.html.content);
});


gulp.task("build",["_tpl","_scss","_script"]);
gulp.task("dev",["tpl","scss","script"]);

gulp.task('serve', function() {
  gulp.run("_w");
  gulp.src($path+'/')
    .pipe(webserver({
      port: 8080, //端口
      host: '192.168.43.179', //域名
      open:true,
      livereload: true, //实时刷新代码。不用f5刷新
      directoryListing: {
        path: $path+'/',
        enable: true
      },
      proxies:[
            {source: '/medicalsys', target: 'http://weixin.tcmtrust.com/medicalsys'}
       ]
    }))
});
