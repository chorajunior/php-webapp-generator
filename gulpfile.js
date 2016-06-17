//initialize all of our variables
var app, concat, gulp, gutil, sass, uglify, imagemin, minifyCSS, del, browserSync, autoprefixer, gulpSequence,
    sourceMaps, plumber, manifest, mainBowerFiles, fontExtensions;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

//load all of our dependencies
//add more here if you want to include more libraries
gulp        = require('gulp');
gutil       = require('gulp-util');
del         = require('del');
concat      = require('gulp-concat');
uglify      = require('gulp-uglify');
sass        = require('gulp-sass');
sourceMaps  = require('gulp-sourcemaps');
imagemin    = require('gulp-imagemin');
minifyCSS   = require('gulp-minify-css');
browserSync = require('browser-sync');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
plumber     = require('gulp-plumber');
manifest = require('asset-builder')('app/assets/manifest.json');
mainBowerFiles     = require('main-bower-files');
fontExtensions = '*.{ttf,otf,eot,woff,woff2,svg}';

gulp.task('browserSync', function() {
    browserSync({
        proxy: manifest.config.devUrl,
        options: {
            reloadDelay: 250
        },
        notify: true
    });
});

gulp.task('images', ['images-deploy']);

// Compressing images & handle SVG files
gulp.task('images-deploy', function() {
    gulp.src(manifest.paths.source + '/images/**/*.{jpg,jpeg,png}')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest(manifest.paths.dist + '/images'));
});

// Copying the system fonts
gulp.task('fonts', function() {
    return gulp.src([manifest.paths.source + '/fonts/**/' + fontExtensions])
        .pipe(gulp.dest(manifest.paths.dist + '/fonts'));
});

//compiling our Javascripts
gulp.task('scripts', function() {
    //this is where our dev JS scripts are
    return gulp.src(manifest.paths.source + '/scripts/**/*.js')
    //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        //this is the filename of the compressed version of our JS
        .pipe(concat('app.js'))
        //catch errors
        .on('error', gutil.log)
        //where we will store our finalized, compressed script
        .pipe(gulp.dest(manifest.paths.dist + '/scripts'))
        //notify browserSync to refresh
        .pipe(browserSync.reload({stream: true}));
});

//compiling our Javascripts for deployment
gulp.task('scripts-deploy', function() {
    //this is where our dev JS scripts are
    return gulp.src(manifest.paths.source + '/scripts/**/*.js')
    //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        //this is the filename of the compressed version of our JS
        .pipe(concat('app.js'))
        //compress :D
        .pipe(uglify())
        //where we will store our finalized, compressed script
        .pipe(gulp.dest(manifest.paths.dist + '/scripts'));
});

//compiling our SCSS files
gulp.task('styles', function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src(manifest.paths.source + '/styles/main.scss')
    //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        //get sourceMaps ready
        .pipe(sourceMaps.init())
        //include SCSS and list every "include" folder
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade:  true
        }))
        //catch errors
        .on('error', gutil.log)
        //the final filename of our combined css file
        .pipe(concat('app.css'))
        //get our sources via sourceMaps
        .pipe(sourceMaps.write())
        //where to save our final, compressed css file
        .pipe(gulp.dest(manifest.paths.dist + '/styles'))
        //notify browserSync to refresh
        .pipe(browserSync.reload({stream: true}));
});

//compiling our SCSS files for deployment
gulp.task('styles-deploy', function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src(manifest.paths.source + '/styles/main.scss')
        .pipe(plumber())
        //include SCSS includes folder
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade:  true
        }))
        //the final filename of our combined css file
        .pipe(concat('app.css'))
        .pipe(minifyCSS())
        //where to save our final, compressed css file
        .pipe(gulp.dest(manifest.paths.dist + '/styles'));
});

// Handling plugin files
gulp.task('plugin-fonts', function(){
    console.log(mainBowerFiles(['/**/' + fontExtensions]));
});

// TODO Other plugin-related tasks

//cleans our dist directory in case things got deleted
gulp.task('clean', function() {
    return del(['app/dist']);
});

//this is our master task when you run `gulp` in CLI / Terminal
//this is the main watcher to use when in active development
//  this will:
//  startup the web server,
//  start up browserSync
//  compress all scripts and SCSS files
gulp.task('default', ['browserSync', 'scripts', 'styles', 'images', 'fonts'], function() {
    console.log(manifest.paths.source);
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch(manifest.paths.source + '/scripts/**', ['scripts']);
    gulp.watch(manifest.paths.source + '/styles/**', ['styles']);
    gulp.watch(manifest.paths.source + '/images/**/*.*', ['images']);
    gulp.watch('app/**/*.php', []);
    gulp.watch('app/**/*.twig', []);
});