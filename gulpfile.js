var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var watch = require('gulp-watch');
var browserify = require('gulp-browserify');
var fs = require('fs');

var files = {
	css: {
		vendor: [
			'bower_components/font-awesome/css/font-awesome.min.css',
			'bower_components/bootstrap/dist/css/bootstrap.min.css',
			'bower_components/select2/dist/css/select2.min.css',
			'bower_components/codemirror/lib/codemirror.css',
			'bower_components/codemirror/addon/fold/foldgutter.css',
			'bower_components/codemirror/addon/dialog/dialog.css',
			'assets/vendor/jquery.layout/jquery.layout.css'
		],
		custom: ['assets/css/*.css'],
		sassFile: ['assets/styles/*.scss']
	},
	js: {
		vendor: [
			'node_modules/appbase-js/dist/appbase.js',
			'node_modules/core-js/client/shim.min.js',
			'node_modules/zone.js/dist/zone.js',
			'node_modules/reflect-metadata/Reflect.js',
			'node_modules/systemjs/dist/system.src.js',
			'bower_components/jquery/dist/jquery.min.js',
			'bower_components/bootstrap/dist/js/bootstrap.min.js',
			'bower_components/select2/dist/js/select2.min.js',
			'bower_components/codemirror/lib/codemirror.js',
			'bower_components/codemirror/addon/search/searchcursor.js',
			'bower_components/codemirror/addon/search/search.js',
			'bower_components/codemirror/addon/dialog/dialog.js',
			'bower_components/codemirror/addon/edit/matchbrackets.js',
			'bower_components/codemirror/addon/edit/closebrackets.js',
			'bower_components/codemirror/addon/comment/comment.js',
			'bower_components/codemirror/addon/comment/comment.js',
			'bower_components/codemirror/addon/fold/foldcode.js',
			'bower_components/codemirror/addon/fold/foldgutter.js',
			'bower_components/codemirror/addon/fold/brace-fold.js',
			'bower_components/codemirror/addon/fold/xml-fold.js',
			'bower_components/codemirror/addon/fold/markdown-fold.js',
			'bower_components/codemirror/addon/fold/comment-fold.js',
			'bower_components/codemirror/mode/javascript/javascript.js',
			'bower_components/codemirror/keymap/sublime.js',
			'bower_components/moment/min/moment.min.js',
			'bower_components/crypto-js/crypto-js.js',
			'assets/vendor/jquery.layout/jquery-ui.js',
			'assets/vendor/jquery.layout/jquery.layout.js',
			'assets/vendor/jquery.simulate.js',
			'bower_components/lzma/src/lzma.js',
			'bower_components/urlsafe-base64/app.js',
			'bower_components/auth0.js/build/auth0.min.js'
		],
		custom: [
			'assets/js/helper.js'
		]
	}
};


gulp.task('vendorcss', function() {
	return gulp.src(files.css.vendor)
		.pipe(concat('vendor.min.css'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('customcss', ['sass'], function() {
	return gulp.src(files.css.custom)
		.pipe(minifyCSS())
		.pipe(concat('style.min.css'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('vendorjs', function() {
	return gulp.src(files.js.vendor)
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(uglify())
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('customjs', function() {
	return gulp.src(files.js.custom)
		.pipe(concat('custom.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(uglify())
		.pipe(concat('custom.min.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('movefonts', function() {
	return gulp.src(['bower_components/font-awesome/fonts/*'])
		.pipe(gulp.dest('dist/fonts'));
});


gulp.task('move_js', function() {
	return gulp.src([
			'node_modules/zone.js/dist/zone.js',
			'node_modules/reflect-metadata/Reflect.js'
		])
		.pipe(gulp.dest('dist/angular/dependency'));
});

// Prepare files for es plugin
gulp.task('build_es_plugin', ['app_dir', 'assets_dir', 'dist_dir'], function() {
	return gulp.src(['index_prod.html'])
		.pipe(rename('index.html'))
		.pipe(gulp.dest('_site'));
});

// copy app dir
gulp.task('app_dir', function() {
	return gulp.src(['app/**/*']).pipe(gulp.dest('_site/app'));
});
// copy assets dir
gulp.task('assets_dir', function() {
	return gulp.src(['assets/**/*']).pipe(gulp.dest('_site/assets'));
});
// copy dist dir
gulp.task('dist_dir', function() {
	return gulp.src(['dist/**/*']).pipe(gulp.dest('_site/dist'));
});

// Prepare files for chrome_extension
gulp.task('build_chrome_extension', ['chrome_app_dir', 'chrome_assets_dir', 'chrome_dist_dir'], function() {
	return gulp.src(['index_prod.html'])
		.pipe(rename('index.html'))
		.pipe(gulp.dest('site'));
});

// copy app dir
gulp.task('chrome_app_dir', function() {
	return gulp.src(['app/**/*']).pipe(gulp.dest('site/app'));
});
// copy assets dir
gulp.task('chrome_assets_dir', function() {
	return gulp.src(['assets/**/*']).pipe(gulp.dest('site/assets'));
});
// copy dist dir
gulp.task('chrome_dist_dir', function() {
	return gulp.src(['dist/**/*']).pipe(gulp.dest('site/dist'));
});


// Include dependency in dist
gulp.task('move_js_depends', function() {
	return gulp.src(['bower_components/jquery/dist/jquery.min.js',
			'bower_components/lzma/src/lzma_worker.js',
			'assets/vendor/JSONURL.js'
		])
		.pipe(gulp.dest('dist/vendor'));
});

function addVersion(fileContent) {
	return fileContent.replace("{{version}}", (new Date()).getTime());
}

gulp.task('build_gh_pages', ['build'], function() {
	var fileContent = fs.readFileSync("mirageSample.appcache", "utf8");
	return fs.writeFileSync('mirage.appcache', addVersion(fileContent));
});

gulp.task('sass', function() {
	return gulp.src(files.css.sassFile)
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(gulp.dest('assets/css'));
});


gulp.task('build', ['compact'], function() {
	gulp.src('app/main.js')
		.pipe(browserify())
		.pipe(concat('build.js'))
		.pipe(gulp.dest('dist/angular'))
		.pipe(uglify())
		.pipe(concat('build.min.js'))
		.pipe(gulp.dest('dist/angular'));
});

gulp.task('compact', ['customcss', 'vendorcss', 'vendorjs', 'customjs', 'movefonts', 'move_js_depends']);

gulp.task('watchfiles', function() {
	gulp.watch(files.css.sassFile, ['customcss']);
	gulp.watch(files.js.custom, ['customjs']);
});

gulp.task('default', ['compact']);

gulp.task('watch', ['compact', 'watchfiles']);
