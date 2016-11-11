var gulp = require('gulp'),
    gutil = require('gulp-util'),
    del = require('del'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourceMaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    cleanCss = require('gulp-clean-css'),
    browserSync = require('browser-sync').create(),
    autoprefixer = require('gulp-autoprefixer'),
    runSequence = require('run-sequence'),
    assetsRev = require('gulp-rev'),
    cssRev = require('gulp-rev-css-url'),
    plumber = require('gulp-plumber'),
    manifest = require('asset-builder')('app/assets/config.json'),
    replace = require('gulp-replace'),
    mainBowerFiles = require('main-bower-files'),
    autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9',
        'opera 12.1', 'ios 6', 'android 4'],
    fontExtensions = '*.{ttf,otf,eot,woff,woff2,svg}',
    imagesExtensions = '*.{jpg,jpeg,png,gif}',
    // Manifest name and options for assets revisions
    manifestRevName = 'manifest.json',
    manifestRevOptions = {
        base: '.',
        merge: true
    };

var regexes = {
    // This regex is responsible for "cleaning" the paths for images in CSS
    cssImages: /(url|src)\((['"])?([\.\/\w]+)\/([\w0-9-_]+\.)(gif|png|jpg|jpeg)\2\)/gm,
    cssFonts: /(url|src)\((['"])?([\.\/\w]+)\/([\w0-9-_]+\.)(eot|svg|woff[2]?|ttf|otf)([\?#a-zA-Z0-9_-]+)?\2\)/gm
};

//============================= Task aggregators =============================//
gulp.task('styles', function () {
    runSequence('plugins-styles', 'app-styles');
});

//========================== Main browser sync task ==========================//
gulp.task('browserSync', function () {
    runSequence('clean', 'app-assets', 'plugins-assets');
    browserSync.init({
        proxy: manifest.config.devUrl,
        options: {
            reloadDelay: 250
        },
        notify: true
    });
});

//============================ App's assets tasks ============================//
// Compressing images
gulp.task('app-images', function () {
    return gulp.src(manifest.paths.source + '/images/**/*.{jpg,jpeg,png}')
        .pipe(plumber())
        .pipe(imagemin({
            optimizationLevel: 6,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(manifest.paths.dist + '/images'));
});

// Copying the system fonts
gulp.task('app-fonts', function () {
    return gulp.src([manifest.paths.source + '/fonts/**/' + fontExtensions])
        .pipe(gulp.dest(manifest.paths.dist + '/fonts'));
});

// Compiling our JavaScripts
gulp.task('app-scripts', function () {
    return gulp.src(manifest.paths.source + '/scripts/**/*.js')
        .pipe(plumber())
        .pipe(concat('app.js'))
        .on('error', gutil.log)
        .pipe(gulp.dest(manifest.paths.dist + '/scripts'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Compiling our SCSS files
gulp.task('app-styles', function () {
    return gulp.src(manifest.paths.source + '/styles/main.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourceMaps.init())
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade: true
        }))
        .on('error', gutil.log)
        .pipe(concat('app.css'))
        .pipe(sourceMaps.write())
        .pipe(replace(regexes.cssImages, '$1($2../images/$4$5$2)'))
        .pipe(replace(regexes.cssFonts, '$1($2../fonts/$4$5$2)'))
        .pipe(gulp.dest(manifest.paths.dist + '/styles'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('app-assets', ['app-scripts', 'app-styles', 'app-images',
    'app-fonts'
]);

//=========================== Plugins' assets tasks ==========================//
gulp.task('plugins', function () {
    runSequence('plugins-fonts', 'plugins-scripts', 'plugins-styles', 'plugins-images');
});

gulp.task('plugins-fonts', function () {
    return gulp.src(mainBowerFiles(['/**/' + fontExtensions]))
        .pipe(gulp.dest(manifest.paths.dist + '/fonts'));
});

gulp.task('plugins-scripts', function () {
    return gulp.src(mainBowerFiles(['/**/*.js']))
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest(manifest.paths.dist + '/scripts'));
});

// This task has a "special" feature: It replaces the images paths based on our
// structure.
gulp.task('plugins-styles', function () {
    return gulp.src(mainBowerFiles(['/**/*.css']))
        .pipe(concat('plugins.css'))
        .pipe(replace(regexes.cssImages, '$1($2../images/$4$5$2)'))
        .pipe(replace(regexes.cssFonts, '$1($2../fonts/$4$5$2)'))
        .pipe(gulp.dest(manifest.paths.dist + '/styles'));
});

gulp.task('plugins-images', function () {
    return gulp.src(mainBowerFiles(['/**/' + imagesExtensions]))
        .pipe(gulp.dest(manifest.paths.dist + '/images'));
});

gulp.task('plugins-assets', ['plugins-fonts', 'plugins-scripts',
    'plugins-styles', 'plugins-images']);

//=========================== General' assets tasks ==========================//
gulp.task('scripts-uglify', function () {
    return gulp.src(manifest.paths.dist + '/build/scripts/*.js')
        .pipe(sourceMaps.init())
        .pipe(uglify())
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(manifest.paths.dist + '/build/scripts'));
});

// Preparing the already compiled CSS files do production
gulp.task('styles-deploy', function () {
    return gulp.src(manifest.paths.dist + '/styles/*.css')
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade: true
        }))
        .pipe(gulp.dest(manifest.paths.dist + '/styles'));
});

gulp.task('styles-uglify', function () {
    return gulp.src(manifest.paths.dist + '/build/styles/*.css')
        .pipe(plumber())
        .pipe(cleanCss())
        .pipe(gulp.dest(manifest.paths.dist + '/build/styles'));
});

//=============================== Utility tasks ==============================//
gulp.task('clean', function () {
    return del(['app/dist']);
});

gulp.task('watch', ['browserSync'], function () {
    gulp.watch(manifest.paths.source + '/scripts/**', ['scripts'], browserSync.reload);
    gulp.watch(manifest.paths.source + '/styles/**', ['styles'], browserSync.reload);
    gulp.watch(manifest.paths.source + '/images/**/*.*', ['images'], browserSync.reload);
    gulp.watch('app/templates/**/*.php', browserSync.reload);
    gulp.watch('app/templates/**/*.twig', browserSync.reload);
});

// Generating hashes of the resources after all of them are placed on dist
// folder.
gulp.task('hash-assets', function () {
    var assetsList = ['images', 'scripts', 'styles', 'fonts'],
        globs = [];

    // Generating all the globs we need
    for (resourceIndex in assetsList) {
        globs.push(manifest.paths.dist + '/' + assetsList[resourceIndex] + '/*.*');
    }

    // Hashing to the build folder
    return gulp.src(globs, {
        base: manifest.paths.dist
    })
        .pipe(assetsRev())
        // Replace assets to hashed versions referenced in CSS files
        .pipe(cssRev())
        .pipe(gulp.dest(manifest.paths.dist + '/build'))
        .pipe(assetsRev.manifest(manifestRevName, manifestRevOptions))
        .pipe(gulp.dest(manifest.paths.dist));
});

// Building the assets
gulp.task('build', function () {
    runSequence(
        'clean',
        'app-assets',
        'plugins-assets',
        'styles-deploy',
        'hash-assets',
        'styles-uglify',
        'scripts-uglify'
    );
});
