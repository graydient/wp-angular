var gulp = require('gulp')
    concat = require('gulp-concat')
    sourcemaps = require('gulp-sourcemaps')
    uglify = require('gulp-uglify')
    ngAnnotate = require('gulp-ng-annotate')
    connect = require('gulp-connect');
    plumber = require( 'gulp-plumber' ),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require( 'gulp-watch' ),
    minifycss = require( 'gulp-minify-css' ),
    jshint = require( 'gulp-jshint' ),
    stylish = require( 'jshint-stylish' ),
    uglify = require( 'gulp-uglify' ),
    rename = require( 'gulp-rename' ),
    notify = require( 'gulp-notify' ),
    include = require( 'gulp-include' ),
    sass = require( 'gulp-sass' );
    bower = require('gulp-bower');
    zip = require('gulp-zip');
    wrap = require("gulp-wrap");
    var browserSync = require('browser-sync').create();


// Config 
var config = {
     bowerDir: './bower_components' 
} 
 
// Default error handler
var onError = function( err ) {
  console.log( 'An error occured:', err.message );
  this.emit('end');
}

// Copy font files
gulp.task('fonts', function() { 
    return gulp.src(config.bowerDir + '/bootstrap/fonts/**.*') 
        .pipe(gulp.dest('./fonts')); 
});

// Zip up everything
gulp.task('zip', function () {
 return gulp.src([
   '*',
   './js/**/*',
   './css/*',
   './dist/*',
   './fonts/*',
   './sass/**/*',
   './partials/**/*',
   '!bower_components',
   '!node_modules',
  ], {base: "."})
  .pipe(zip('ngWP.zip'))
  .pipe(gulp.dest('.'));
});

//Concat only bower JS files needed
gulp.task('vendorjs', function() {
  return gulp.src([
    config.bowerDir + '/angular/angular.min.js',
    config.bowerDir + '/angular-animate/angular-animate.min.js',
    config.bowerDir + '/angular-bootstrap/ui-bootstrap-tpls.min.js',
    config.bowerDir + '/angular-loading-bar/build/loading-bar.min.js',
    config.bowerDir + '/angular-sanitize/angular-sanitize.min.js',
    config.bowerDir + '/angular-ui-router/release/angular-ui-router.min.js',
    config.bowerDir + '/angular-ui-router-title/src/angular-ui-router-title.js',
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( gulp.dest( './dist' ) )
    .pipe( notify({ message: 'vendorjs task complete' }))
});

//Concat bower CSS files needed
gulp.task('vendorcss', function() {
  return gulp.src([
    config.bowerDir + '/bootstrap/dist/css/bootstrap.min.css',
    config.bowerDir + '/angular-bootstrap/ui-bootstrap-csp.css',
    config.bowerDir + '/angular-loading-bar/build/loading-bar.min.css',
    ])
    .pipe( concat('vendor.css'))
    .pipe( gulp.dest('./dist/'))
    .pipe( minifycss())
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( gulp.dest( './dist' ) )
    .pipe( notify({ message: 'vendorcss task complete' }))

});

// Install all Bower components
gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(config.bowerDir))
});  

// Concat all the Angular JS files to app.js
gulp.task('js', function () {
  gulp.src(['js/**/module.js', 'js/**/*.js'])
    .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.'))
});


// Convert sass to css
gulp.task('sass', function(){
  return gulp.src('sass/*.scss')
    // Initializes sourcemaps
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true
     }))
    // Writes sourcemaps into the CSS file
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});
// Start a server
gulp.task('serve', function() {
    connect.server({
      port: 3000,
      fallback: 'index.html',
      livereload: true
    });
});

//  Watch files for change
gulp.task( 'watch', function() {
 
 gulp.watch('sass/*.scss', ['sass']); 
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('**/*.html', browserSync.reload); 
  gulp.watch('js/**/*.js', browserSync.reload);
  console.log('To stop watching type control c');

} ); 
 
gulp.task( 'default', ['browserSync', 'watch'], function() {
 // Does nothing in this task, just triggers the dependent 'watch'
} );

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
  })
})
