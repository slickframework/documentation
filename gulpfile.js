var gulp = require('gulp'), 
sass = require('gulp-ruby-sass') 
notify = require("gulp-notify") 
bower = require('gulp-bower');

var config = {
     "sassPath": './scss',
     "bowerDir": './bower_components' 
}

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir)) 
});

gulp.task('icons', ['bower'], function() { 
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
    .pipe(gulp.dest('./source/fonts')); 
});

gulp.task('css', ['bower'], function() { 
    return gulp.src(config.sassPath + '/style.scss')
         .pipe(sass({
             style: 'compressed',
             loadPath: [
                 './resources/sass',
                 config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
                 config.bowerDir + '/fontawesome/scss',
             ]
             }) 
.on("error", notify.onError(function (error) {
                     return "Error: " + error.message;
             }))) 
         .pipe(gulp.dest('./source/css')); 
});


gulp.task('copy', ['bower'], function () {
    return gulp.src([
        config.bowerDir + '/bootstrap-sass-official/assets/javascripts/bootstrap.min.js',
        config.bowerDir + '/jquery/dist/jquery.min.*'
    ])
        .pipe(gulp.dest('./source/js'));
});


// Rerun the task when a file changes
 gulp.task('watch', function() {
         gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
});

  gulp.task('default', ['bower', 'icons', 'css', 'copy']);