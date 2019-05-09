// Require our dependencies
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const bourbon = require( 'bourbon' ).includePaths;
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cssnano = require('cssnano');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const mqpacker = require( 'css-mqpacker' );
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sort = require( 'gulp-sort' );
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// Some config data for our tasks
const config = {
  styles: {
    //admin: 'assets/sass/admin.scss',
    front_end: 'assets/sass/*.scss',
    main: 'sass/**/*.scss',
    srcDir: 'assets/sass',
    front_end_dest: 'assets/css',
    main_dest: './'
  },
  scripts: {
    //admin: './assets/js/admin/**/*.js',
    main: './assets/js/src/**/*.js',
    uglify: [ 'assets/js/*.js', '!assets/js/*.min.js', '!assets/js/customizer.js' ],
    dest: './assets/js'
  },
  images: {
  	main: './assets/img/**/*',
  	dest: './assets/img/'
  },
  browserSync: {
    active: false,
    localURL: 'mylocalsite.local'
  }
};

function adminstyles() {
  return gulp.src(config.styles.admin)
    .pipe(sourcemaps.init()) // Sourcemaps need to init before compilation
    .pipe(sassGlob()) // Allow for globbed @import statements in SCSS
    .pipe(sass()) // Compile
    .on('error', sass.logError) // Error reporting
    .pipe(postcss([
		autoprefixer( {
			'browsers': [ 'last 2 version' ]
		} ),
		mqpacker( {
			'sort': true
		} ),
      	cssnano( {
			'safe': true // Use safe optimizations.
		} ) // Minify
    ]))
    .pipe(sourcemaps.write()) // Write the sourcemap files
    .pipe(gulp.dest(config.styles.dest)) // Drop the resulting CSS file in the specified dir
    .pipe(browserSync.stream());
}

function frontendstyles() {
  return gulp.src(config.styles.front_end)
    .pipe(sourcemaps.init()) // Sourcemaps need to init before compilation
    .pipe(sassGlob()) // Allow for globbed @import statements in SCSS
    .pipe(sass( {
    		'includePaths': bourbon
    	}
    )) // Compile
    .on('error', sass.logError) // Error reporting
    .pipe(postcss([
		autoprefixer( {
			'browsers': [ 'last 2 version' ]
		} ),
		mqpacker( {
			'sort': true
		} ),
      	cssnano( {
			'safe': true // Use safe optimizations.
		} ) // Minify
    ]))
    .pipe(sourcemaps.write()) // Write the sourcemap files
    .pipe(gulp.dest(config.styles.front_end_dest)) // Drop the resulting CSS file in the specified dir
    .pipe(browserSync.stream());
}

function mainstyles() {
  return gulp.src(config.styles.main)
    .pipe(sourcemaps.init()) // Sourcemaps need to init before compilation
    .pipe(sassGlob()) // Allow for globbed @import statements in SCSS
    .pipe(sass( {
    		'includePaths': bourbon
    	}
    )) // Compile
    .on('error', sass.logError) // Error reporting
    .pipe(postcss([
		autoprefixer( {
			'browsers': [ 'last 2 version' ]
		} ),
		mqpacker( {
			'sort': true
		} ),
      	cssnano( {
			'safe': true // Use safe optimizations.
		} ) // Minify
    ]))
    .pipe(sourcemaps.write()) // Write the sourcemap files
    .pipe(gulp.dest(config.styles.main_dest)) // Drop the resulting CSS file in the specified dir
    .pipe(browserSync.stream());
}

function adminscripts() {
  return gulp.src(config.scripts.admin)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(concat('admin.js')) // Concatenate
    .pipe(uglify()) // Minify + compress
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.scripts.dest))
    .pipe(browserSync.stream());
}

function mainscripts() {
  return gulp.src(config.scripts.main)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(concat('minnpost.js')) // Concatenate
    /*.pipe(uglify()) // Minify + compress
    .pipe(rename({
      suffix: '.min'
    }))*/
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.scripts.dest))
    .pipe(browserSync.stream());
}

function uglifyscripts() {
  return gulp.src(config.scripts.uglify)
    .pipe(uglify()) // Minify + compress
    .pipe(rename({
      suffix: '.min'
    }))
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(config.scripts.dest))
    .pipe(browserSync.stream());
}

// Optimize Images
function images() {
  return gulp
    .src(config.images.main)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest(config.images.dest));
}

// Injects changes into browser
function browserSyncTask() {
  if (config.browserSync.active) {
    browserSync.init({
      proxy: config.browserSync.localURL
    });
  }
}

// Reloads browsers that are using browsersync
function browserSyncReload(done) {
  browserSync.reload();
  done();
}

// Watch directories, and run specific tasks on file changes
function watch() {
  gulp.watch(config.styles.srcDir, styles);
  gulp.watch(config.scripts.admin, adminscripts);
  
  // Reload browsersync when PHP files change, if active
  if (config.browserSync.active) {
    gulp.watch('./**/*.php', browserSyncReload);
  }
}

// export tasks
exports.adminstyles    = adminstyles;
exports.frontendstyles = frontendstyles;
exports.mainstyles     = mainstyles;
exports.adminscripts   = adminscripts;
exports.mainscripts    = mainscripts;
exports.uglifyscripts  = uglifyscripts;
exports.images         = images;
exports.watch          = watch;

// What happens when we run gulp?
gulp.task('default',
  gulp.series(
    gulp.parallel(frontendstyles, mainstyles, mainscripts, uglifyscripts, images) // run these tasks asynchronously
  )
);


/*
gulp.task( 'markup', browserSync.reload );
gulp.task( 'i18n', [ 'wp-pot' ] );
gulp.task( 'icons', [ 'svg' ] );
gulp.task( 'scripts', [ 'uglify' ] );
gulp.task( 'styles', [ 'cssnano', 'cssnano_print', 'asset_cssnano' ] );
gulp.task( 'sprites', [ 'spritesmith' ] );
gulp.task( 'lint', [ 'sass:lint', 'js:lint' ] );
gulp.task( 'default', [ 'i18n', 'icons', 'styles', 'scripts', 'imagemin'] );
*/