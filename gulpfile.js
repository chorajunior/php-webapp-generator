// Load all of our dependencies
var gulp                  = require( 'gulp' ),
    gutil                 = require( 'gulp-util' ),
    del                   = require( 'del' ),
    concat                = require( 'gulp-concat' ),
    uglify                = require( 'gulp-uglify' ),
    sass                  = require( 'gulp-sass' ),
    sourceMaps            = require( 'gulp-sourcemaps' ),
    imagemin              = require( 'gulp-imagemin' ),
    cleanCss              = require( 'gulp-clean-css' ),
    browserSync           = require( 'browser-sync' ).create(),
    autoprefixer          = require( 'gulp-autoprefixer' ),
    runSequence           = require( 'run-sequence' ),
    assetsRev             = require( 'gulp-rev' ),
    cssRev                = require( 'gulp-rev-css-url' ),
    cssRebaseUrl          = require( 'gulp-css-rebase-urls' ),
    plumber               = require( 'gulp-plumber' ),
    manifest              = require( 'asset-builder' )( 'app/assets/config.json' ),
    replace               = require( 'gulp-replace' ),
    mainBowerFiles        = require( 'main-bower-files' ),
    autoPrefixBrowserList = [ 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4' ],
    fontExtensions        = '*.{ttf,otf,eot,woff,woff2,svg}',
    imagesExtensions      = '*.{jpg,jpeg,png,gif}',
    // Manifest name and options for assets revisions
    manifestRevName       = 'manifest.json',
    manifestRevOptions    = { base: '.', merge: true };

var regexes = {
    // This regex is responsible for "cleaning" the paths for images
    css: /(url|src)\((['"]?)(.*(\/)(.*[gif|jpeg|jpg|png])\2\))/gm
};

gulp.task( 'browserSync', [ 'plugins', 'scripts', 'styles', 'images', 'fonts' ], function () {
    browserSync.init( {
        proxy  : manifest.config.devUrl,
        options: {
            reloadDelay: 250
        },
        notify : true
    } );
} );

gulp.task( 'images', [ 'images-deploy' ] );

// Compressing images & handle SVG files
gulp.task( 'images-deploy', function () {
    return gulp.src( manifest.paths.source + '/images/**/*.{jpg,jpeg,png}' )
        .pipe( plumber() )
        .pipe( imagemin( { optimizationLevel: 9, progressive: true, interlaced: true } ) )
        .pipe( gulp.dest( manifest.paths.dist + '/images' ) );
} );

// Copying the system fonts
gulp.task( 'fonts', function () {
    return gulp.src( [ manifest.paths.source + '/fonts/**/' + fontExtensions ] )
        .pipe( gulp.dest( manifest.paths.dist + '/fonts' ) );
} );

// Compiling our JavaScripts
gulp.task( 'scripts', function () {
    return gulp.src( manifest.paths.source + '/scripts/**/*.js' )
        .pipe( plumber() )
        .pipe( concat( 'app.js' ) )
        .on( 'error', gutil.log )
        .pipe( gulp.dest( manifest.paths.dist + '/scripts' ) )
        .pipe( browserSync.reload( { stream: true } ) );
} );

// Compiling our JavaScripts for deployment
gulp.task( 'scripts-deploy', function () {
    return gulp.src( manifest.paths.dist + '/scripts/*.js' )
        .pipe( plumber() )
        .pipe( uglify() )
        .pipe( gulp.dest( manifest.paths.dist + '/scripts/build' ) );
} );

// Compiling our SCSS files
gulp.task( 'styles', function () {
    return gulp.src( manifest.paths.source + '/styles/main.scss' )
        .pipe( plumber( {
            errorHandler: function ( err ) {
                console.log( err );
                this.emit( 'end' );
            }
        } ) )
        .pipe( sourceMaps.init() )
        .pipe( sass( {
            errLogToConsole: true
        } ) )
        .pipe( autoprefixer( {
            browsers: autoPrefixBrowserList,
            cascade : true
        } ) )
        .on( 'error', gutil.log )
        .pipe( concat( 'app.css' ) )
        .pipe( sourceMaps.write() )
        .pipe( gulp.dest( manifest.paths.dist + '/styles' ) )
        .pipe( browserSync.reload( { stream: true } ) );
} );

// Preparing the already compiled CSS files do production
gulp.task( 'styles-deploy', function () {
    return gulp.src( manifest.paths.dist + '/styles/*.css' )
        .pipe( plumber() )
        .pipe( autoprefixer( {
            browsers: autoPrefixBrowserList,
            cascade : true
        } ) )
        .pipe( cssRebaseUrl( { root : manifest.paths.dist + '/build' } ) )
        .pipe( cleanCss() )
        .pipe( gulp.dest( manifest.paths.dist + '/styles' ) );
} );

// Handling plugin files
gulp.task( 'plugins-fonts', function () {
    return gulp.src( mainBowerFiles( [ '/**/' + fontExtensions ] ) )
        .pipe( gulp.dest( manifest.paths.dist + '/fonts' ) );
} );

gulp.task( 'plugins-scripts', function () {
    return gulp.src( mainBowerFiles( [ '/**/*.js' ] ) )
        .pipe( concat( 'plugins.js' ) )
        .pipe( gulp.dest( manifest.paths.dist + '/scripts' ) );
} );

// This task has a "special" feature: It replaces the images paths based on our structure.
gulp.task( 'plugins-styles', function () {
    return gulp.src( mainBowerFiles( [ '/**/*.css' ] ) )
        .pipe( concat( 'plugins.css' ) )
        .pipe( replace( regexes.css, '$1($2../images/$5$2)' ) )
        .pipe( gulp.dest( manifest.paths.dist + '/styles' ) );
} );

gulp.task( 'plugins-images', function () {
    return gulp.src( mainBowerFiles( [ '/**/' + imagesExtensions ] ) )
        .pipe( gulp.dest( manifest.paths.dist + '/images' ) );
} );

// Just a shortcut to prepare the app's assets
gulp.task( 'app-assets', [ 'scripts', 'styles', 'images', 'fonts' ] );
gulp.task( 'plugins', [ 'plugins-fonts', 'plugins-scripts', 'plugins-styles', 'plugins-images' ] );

gulp.task( 'clean', function () {
    return del( [ 'app/dist' ] );
} );

gulp.task( 'watch', [ 'clean ', 'plugins', 'browserSync' ], function () {
    gulp.watch( manifest.paths.source + '/scripts/**', [ 'scripts' ] );
    gulp.watch( manifest.paths.source + '/styles/**', [ 'styles' ] );
    gulp.watch( manifest.paths.source + '/images/**/*.*', [ 'images' ] );
    gulp.watch( 'app/templates/**/*.php', browserSync.reload );
    gulp.watch( 'app/templates/**/*.twig', browserSync.reload );
} );

// Build tasks
gulp.task( 'hash-assets', function() {
    // Generating hashes of the resources after all of them are placed on dist folder.
    var assetsList = ['images', 'scripts', 'styles', 'fonts'],
        globs = [];

    // Generating all the globs we need
    for ( resourceIndex in assetsList ) {
        globs.push( manifest.paths.dist + '/' + assetsList[ resourceIndex ] + '/*.*' );
    }

    // Hashing to the build folder
    return gulp.src( globs, { base: manifest.paths.dist } )
        .pipe( assetsRev() )
        // Replace assets to hashed versions referenced in CSS files
        .pipe( cssRev() )
        .pipe( gulp.dest( manifest.paths.dist + '/build' ) )
        .pipe( assetsRev.manifest( manifestRevName, manifestRevOptions ) )
        .pipe( gulp.dest( manifest.paths.dist ) );
} );

gulp.task( 'build', function () {
    runSequence(
        'clean',
        'scripts-deploy',
        'fonts',
        'app-assets',
        'plugins',
        'styles-deploy',
        'hash-assets'
    );
} );