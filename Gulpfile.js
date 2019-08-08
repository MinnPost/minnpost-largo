// Require our dependencies
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const bourbon = require( 'bourbon' ).includePaths;
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cssnano = require('cssnano');
const eslint = require('gulp-eslint');
const fs = require('fs');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const packagejson = JSON.parse(fs.readFileSync('./package.json'));
const mqpacker = require( 'css-mqpacker' );
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sort = require( 'gulp-sort' );
const gulpStylelint = require('gulp-stylelint');
const sourcemaps = require('gulp-sourcemaps');
const svgmin = require( 'gulp-svgmin' );
const uglify = require('gulp-uglify');
const wpPot = require('gulp-wp-pot');

// Some config data for our tasks
const config = {
  styles: {
    front_end: 'assets/sass/*.scss',
    main: 'sass/**/*.scss',
    srcDir: 'assets/sass',
    lint_src: [ 'assets/sass/**/*.scss', 'sass/**/*.scss' ],
    lint_dest: 'assets/sass/',
    front_end_dest: 'assets/css',
    main_dest: './'
  },
  scripts: {
    admin_src: './assets/js/src/admin/**/*.js',
    main: './assets/js/src/front-end/**/*.js',
    uglify: [ 'assets/js/*.js', '!assets/js/*.min.js', '!assets/js/customizer.js' ],
    dest: './assets/js'
  },
  images: {
  	main: './assets/img/**/*',
  	dest: './assets/img/'
  },
  languages: {
    src: [ './**/*.php', '!vendor/*' ],
    dest: './languages/' + packagejson.name + '.pot'
  },
  browserSync: {
    active: false,
    localURL: 'mylocalsite.local'
  }
};

function adminstyles() {
  return gulp.src(config.styles.admin, { allowEmpty: true })
    .pipe(sourcemaps.init()) // Sourcemaps need to init before compilation
    .pipe(sassGlob()) // Allow for globbed @import statements in SCSS
    .pipe(sass()) // Compile
    .on('error', sass.logError) // Error reporting
    .pipe(postcss([
      mqpacker( {
        'sort': true
      } ),
      cssnano( {
        'safe': true // Use safe optimizations.
      } ) // Minify
    ]))
    .pipe(rename({ // Rename to .min.css
      suffix: '.min'
    }))
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

function sasslint() {
  return gulp.src(config.styles.lint_src)
    .pipe(gulpStylelint({
      fix: true
    }))
    .pipe(gulp.dest(config.styles.lint_dest));
}

function adminscripts() {
  return gulp.src(config.scripts.admin_src, { allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(concat(packagejson.name + '-admin.js')) // Concatenate
    .pipe(sourcemaps.write())
    .pipe(eslint())
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

function svgminify() {
	return gulp.src( config.images.main + '.svg' )
        .pipe(svgmin())
        .pipe(gulp.dest(config.images.dest));
}

// Generates translation file.
function translate() {
    return gulp
      .src( config.languages.src )
      .pipe( wpPot( {
        domain: packagejson.name,
        package: packagejson.name
      } ) )
      .pipe( gulp.dest( config.languages.dest ) );
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

// define complex gulp tasks
const styles  = gulp.series(gulp.parallel(frontendstyles, mainstyles));
const scripts = gulp.series(gulp.parallel(mainscripts, adminscripts), uglifyscripts);
const build   = gulp.series(gulp.parallel(styles, scripts, images, svgminify, translate));

// export tasks
exports.styles    = styles;
exports.scripts   = scripts;
exports.images    = images;
exports.svgminify = svgminify;
exports.translate = translate;
exports.watch     = watch;
exports.default   = build;
