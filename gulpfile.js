/**
 * Created by Administrator on 2017/3/8.
 */
var gulp = require('gulp'),

 htmlmin = require('gulp-htmlmin');   //压缩html
uglify = require('gulp-uglify');   //压缩js
cssmin = require('gulp-clean-css');   //压缩css
cssver = require('gulp-make-css-url-version');  //版本号问题
  replace = require('gulp-url-replace');
  imagesmin = require('gulp-imagemin');
 del = require('del');

gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js', 'dist/EC_WEB','dist/images',"dist/plugins"], cb);
});

//gulp.task('clean', function (cb) {del(['dist/**'], cb);});

gulp.task('html-min', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/EC_WEB/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/EC_WEB'));
});

gulp.task('replace-html', function(){
    gulp.src('src/EC_WEB/*.html')
        .pipe(replace({
            'src/': 'dist/'
        }))
        .pipe(gulp.dest("dist/EC_WEB"))
});

gulp.task('replace-css', function(){       //css路径为修改
    gulp.src('src/js/pages/*.js')
        .pipe(replace({
            'src/': 'dist/'
        }))
        .pipe(gulp.dest("dist/js/pages"))
});



gulp.task('js-js', function () {   //js文件夹下的js
    gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('plugins-js', function () {       //plugins文件夹下的js
    gulp.src('src/plugins/**/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/plugins'));
});

gulp.task('css-css', function () {  //css文件夹下的css
    gulp.src('src/css/*.css')
        //.pipe(cssver("1.0.0")) //给css文件里引用文件加版本号（文件MD5）
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('plugins-css', function () {  //plugins文件夹下的css
    gulp.src('src/plugins/**/css/*.css')
       //gulp  .pipe(cssver("1.0.0")) //给css文件里引用文件加版本号（文件MD5）
        .pipe(cssmin())
        .pipe(gulp.dest('dist/plugins'));
});


gulp.task('images-min', function () {
    gulp.src('src/images/*.{png,jpg,gif,ico}')
        .pipe(imagesmin())
        .pipe(gulp.dest('dist/images'));
});


gulp.task('default',
    ['images-min','html-min', 'plugins-js','plugins-css','css-css', 'js-js']);



//gulp.task('deploy', ['clean'], function(){      //异步删除方式，先执行一边clean，之后再执行less这三个方法
//    gulp.start('html-min', 'js-js','css-css','plugins-js','plugins-css','replace-html','replace-css');
//});
