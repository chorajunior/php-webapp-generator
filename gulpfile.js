var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSync = require('browser-sync');
var del = require('del');
var wiredep = require('wiredep').stream;
var mainBowerfiles = require('main-bower-files');
var $ = gulpLoadPlugins();
var reload = browserSync.reload;

gulp.task('styles', function() {
  return gulp.src('assets/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/styles/build'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', function() {
  return gulp.src(['assets/scripts/**/*.js', '!assets/scripts/build/**/*.js'])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/scripts/build'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return function() {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}

var testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint', lint(['assets/scripts/**/*.js', '!assets/scripts/main.js']));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('phplib', function() {
  return gulp.src('./vendor/**/*.*')
      .pipe(gulp.dest('dist/vendor'));
});

gulp.task('images', ['plugin-images'],function() {
  return gulp.src('assets/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('assets/images/build'));
});

gulp.task('plugin-images', function() {
  return gulp.src(mainBowerfiles('**/*.{jpg,gif,png}', function(err) {}))
    .pipe(gulp.dest('assets/images'));
});

gulp.task('fonts', function() {
  return gulp.src(mainBowerfiles('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('assets/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'scripts', 'fonts'], function() {
  browserSync({
    notify: false,
    proxy: 'http://conferenciavida.dev',
    port: 9000
  });

  gulp.watch([
    'app/*.php',
    'assets/scripts/**/*.js',
    'assets/images/**/*',
    'assets/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('assets/styles/**/*.scss', ['styles']);
  gulp.watch('assets/scripts/**/*.js', ['scripts']);
  gulp.watch('assets/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// inject bower components
gulp.task('wiredep', function() {
  gulp.src('assets/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('assets/styles'));

  gulp.src('app/*.php')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'images', 'fonts'], function() {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
