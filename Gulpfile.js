// Require our dependencies
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cssnano = require('cssnano');
const eslint = require('gulp-eslint');
const fs = require('fs');
const gulp = require('gulp');
const iife = require('gulp-iife');
const imagemin = require('gulp-imagemin');
const packagejson = JSON.parse(fs.readFileSync('./package.json'));
const mqpacker = require( 'css-mqpacker' );
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const realFavicon = require ('gulp-real-favicon');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
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
		admin: 'sass_admin/*.scss',
		front_end: 'assets/sass/*.scss',
		main: 'sass/**/*.scss',
		srcDir: 'assets/sass',
		admin_lint_dest: './sass_admin/',
		front_end_lint_dest: 'assets/sass/',
		front_end_dest: 'assets/css',
		main_lint_dest: './sass',
		admin_dest: './',
		main_dest: './'
	},
	scripts: {
		admin_src: './assets/js/src/admin/**/*.js',
		admin_lint: "./assets/js/src/admin/",
		main: [ './assets/js/vendor/front-end/**/*.js', './assets/js/src/front-end/**/*.js' ],
		main_lint_src: [ './assets/js/src/front-end/**/*.js' ],
		main_lint_dest: "./assets/js/src/front-end/",
		uglify: [ 'assets/js/*.js', '!assets/js/*.min.js', '!assets/js/customizer.js' ],
		dest: './assets/js'
	},
	images: {
		main: './assets/img/**/*',
		dest: './assets/img/'
	},
	favicon: {
		json_file: './assets/img/app-icons/faviconData.json',
		html_file: './assets/img/app-icons/icons.html',
		src_file: './assets/img/minnpost-app-icon.png',
		dest: './assets/img/app-icons/',
		icons_uri_path: '/wp-content/themes/minnpost-largo/assets/img/app-icons/'
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
	return gulp
		.src(config.styles.admin, { allowEmpty: true })
		.pipe(sourcemaps.init()) // Sourcemaps need to init before compilation
		.pipe(sassGlob()) // Allow for globbed @import statements in SCSS
		.pipe(sass()) // Compile
		.on("error", sass.logError) // Error reporting
		.pipe(
			postcss([
				mqpacker({
					sort: true
				}),
				autoprefixer(),
				cssnano({
					safe: true // Use safe optimizations.
				}) // Minify
			])
		)
		.pipe(sourcemaps.write()) // Write the sourcemap files
		.pipe(gulp.dest(config.styles.admin_dest)) // Drop the resulting CSS file in the specified dir
		.pipe(browserSync.stream());
}

function adminsasslint() {
	return gulp.src(config.styles.admin)
		.pipe(gulpStylelint({
			fix: true
		}))
		.pipe(gulp.dest(config.styles.admin_lint_dest));
}

function frontendstyles() {
	return gulp
		.src(config.styles.front_end, { allowEmpty: true })
		.pipe(sourcemaps.init()) // Sourcemaps need to init before compilation
		.pipe(sassGlob()) // Allow for globbed @import statements in SCSS
		.pipe(sass()) // Compile
		.on("error", sass.logError) // Error reporting
		.pipe(
			postcss([
				mqpacker({
					sort: true
				}),
				autoprefixer(),
				cssnano({
					safe: true // Use safe optimizations.
				}), // Minify
			])
		)
		.pipe(sourcemaps.write()) // Write the sourcemap files
		.pipe(gulp.dest(config.styles.front_end_dest)) // Drop the resulting CSS file in the specified dir
		.pipe(browserSync.stream());
}

function frontendsasslint() {
	return gulp.src(config.styles.front_end)
		.pipe(gulpStylelint({
			fix: true
		}))
		.pipe(gulp.dest(config.styles.front_end_lint_dest));
}

function mainstyles() {
	return gulp
		.src(config.styles.main, { allowEmpty: true })
		.pipe(sourcemaps.init()) // Sourcemaps need to init before compilation
		.pipe(sassGlob()) // Allow for globbed @import statements in SCSS
		.pipe(sass()) // Compile
		.on("error", sass.logError) // Error reporting
		.pipe(
			postcss([
				mqpacker({
					sort: true
				}),
				autoprefixer(),
				cssnano({
					safe: true // Use safe optimizations.
				}), // Minify
			])
		)
		.pipe(sourcemaps.write()) // Write the sourcemap files
		.pipe(gulp.dest(config.styles.main_dest)) // Drop the resulting CSS file in the specified dir
		.pipe(browserSync.stream());
}

function mainsasslint() {
	return gulp.src(config.styles.main)
		.pipe(gulpStylelint({
			fix: true
		}))
		.pipe(gulp.dest(config.styles.main_lint_dest));
}

function adminscripts() {
	return gulp
		.src(config.scripts.admin_src, { allowEmpty: true })
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ["@babel/preset-env"]
			})
		)
		.pipe(concat(packagejson.name + "-admin.js")) // Concatenate
		.pipe(sourcemaps.write())
		.pipe(eslint())
		.pipe(iife({
				useStrict: false,
				params: ['$'],
				args: ['jQuery']
			}))
		.pipe(gulp.dest(config.scripts.dest))
		.pipe(browserSync.stream());
}

function mainscripts() {
	return gulp
		.src(config.scripts.main)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ["@babel/preset-env"]
			})
		)
		.pipe(concat('minnpost.js')) // Concatenate
		.pipe(sourcemaps.write())
		.pipe(eslint())
		.pipe(iife({
				useStrict: false,
				params: ['$'],
				args: ['jQuery']
			}))
		.pipe(gulp.dest(config.scripts.dest))
		.pipe(browserSync.stream());
}

function adminscriptlint() {
	return gulp
		.src(config.scripts.admin_src)
		.pipe(eslint({fix:true}))
		.pipe(eslint.format())
		.pipe(gulp.dest(config.scripts.admin_lint))
		// Brick on failure to be super strict
		//.pipe(eslint.failOnError());
};

function mainscriptlint() {
	return gulp
		.src(config.scripts.main_lint_src)
		.pipe(eslint({fix:true}))
		.pipe(eslint.format())
		.pipe(gulp.dest(config.scripts.main_lint_dest))
		// Brick on failure to be super strict
		//.pipe(eslint.failOnError());
};

function uglifyscripts() {
	return (
		gulp
			.src(config.scripts.uglify)
			.pipe(uglify()) // Minify + compress
			.pipe(
				rename({
					suffix: ".min"
				})
			)
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(config.scripts.dest))
			.pipe(browserSync.stream())
	);
}

// Optimize Images
function images() {
	return gulp
		.src(config.images.main)
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 90, progressive: true }),
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

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
function generate_favicons(done) {
  realFavicon.generateFavicon({
    masterPicture: config.favicon.src_file,
    dest: config.favicon.dest,
    iconsPath: config.favicon.icons_uri_path,
    design: {
      ios: {
        pictureAspect: 'noChange',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
      }
    },
    desktopBrowser: {
      design: 'raw'
    },
    windows: {
      pictureAspect: 'noChange',
      backgroundColor: '#801018',
      onConflict: 'override',
      assets: {
        windows80Ie10Tile: false,
        windows10Ie11EdgeTiles: {
          small: true,
          medium: true,
          big: true,
          rectangle: true
        }
      }
    },
    androidChrome: {
      pictureAspect: 'noChange',
      themeColor: '#ffffff',
      manifest: {
        display: 'standalone',
        orientation: 'notSet',
        onConflict: 'override',
        declared: true
      },
      assets: {
        legacyIcon: false,
        lowResolutionIcons: false
      }
    },
    safariPinnedTab: {
      pictureAspect: 'blackAndWhite',
      threshold: 50,
      themeColor: '#801018'
    }
  },
  settings: {
    scalingAlgorithm: 'Mitchell',
    errorOnImageTooSmall: false,
    readmeFile: false,
    htmlCodeFile: false,
    usePathAsIs: false
  },
  markupFile: config.favicon.json_file
  }, function() {
  done();
  });
}

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
function inject_favicon_markups() {
  return gulp.src([ config.favicon.html_file ])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(config.favicon.json_file)).favicon.html_code))
    .pipe(gulp.dest(config.favicon.dest));
}

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
function check_for_favicon_update(done) {
  var currentVersion = JSON.parse(fs.readFileSync(config.favicon.json_file)).version;
  realFavicon.checkForUpdates(currentVersion, function(err) {
    if (err) {
      throw err;
    }
  });
}

function svgminify() {
	return gulp.src( config.images.main + '.svg' )
				.pipe(svgmin())
				.pipe(gulp.dest(config.images.dest));
}

// Generates translation file.
function translate() {
	return gulp
		.src(config.languages.src)
		.pipe(
			wpPot({
				domain: packagejson.name,
				package: packagejson.name
			})
		)
		.pipe(gulp.dest(config.languages.dest));
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
	gulp.watch(config.scripts.admin_src, adminscripts);
	
	// Reload browsersync when PHP files change, if active
	if (config.browserSync.active) {
		gulp.watch('./**/*.php', browserSyncReload);
	}
}

// define complex gulp tasks
const lint       = gulp.series(gulp.parallel(frontendsasslint, adminsasslint, mainsasslint, adminscriptlint, mainscriptlint));
const stylelint  = gulp.series(gulp.parallel(frontendsasslint, adminsasslint, mainsasslint));
const scriptlint = gulp.series(gulp.parallel(adminscriptlint, mainscriptlint));
const styles     = gulp.series(gulp.parallel(frontendstyles, adminstyles, mainstyles));
const scripts    = gulp.series(gulp.parallel(mainscripts, adminscripts), uglifyscripts);
const build      = gulp.series(gulp.parallel(styles, scripts, images, svgminify, translate));

// export tasks
exports.lint                   = lint;
exports.stylelint              = stylelint;
exports.styles                 = styles;
exports.scriptlint             = scriptlint;
exports.scripts                = scripts;
exports.images                 = images;
exports.generate_favicons      = generate_favicons;
exports.inject_favicon_markups = inject_favicon_markups;
exports.svgminify              = svgminify;
exports.translate              = translate;
exports.watch                  = watch;
exports.default                = build;

