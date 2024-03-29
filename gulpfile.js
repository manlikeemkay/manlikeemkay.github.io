/* globals require */
"use strict";

var autoprefixer = require("gulp-autoprefixer"),
    babel = require("gulp-babel"),
    browserSync = require("browser-sync").create(),
    bump = require("gulp-bump"),
    clean = require("gulp-clean"),
    cssmin = require("gulp-cssmin"),
    gulp = require("gulp"),
    gutil = require("gulp-util"),
    npmPackage = require("./package.json"),
    removeEmptyLines = require("gulp-remove-empty-lines"),
    runSequence = require("gulp4-run-sequence"),
    sass = require("gulp-sass")(require("node-sass")),
    stripCSSComments = require("gulp-strip-css-comments"),
    uglify = require("gulp-uglify"),
    uncss = require("gulp-uncss"),
    zip = require("gulp-zip");

gulp.task("clean", function () {
    return gulp.src("dist", { read: false, allowEmpty: true }).pipe(clean());
});

gulp.task("update", function () {
    return gulp
        .src(["node_modules/aos/dist/aos.js"])
        .pipe(gulp.dest("src/js/vendor/"));
});

gulp.task("copy", function (done) {
    gulp.src("src/fonts/**/**").pipe(gulp.dest("dist/fonts/"));
    gulp.src(["src/images/**/**", "!src/images/favicons"]).pipe(
        gulp.dest("dist/images/")
    );
    gulp.src(["src/images/favicons/**/**"]).pipe(gulp.dest("dist/"));
    gulp.src("src/js/**/**").pipe(gulp.dest("dist/js/"));
    gulp.src("src/**/**.html").pipe(gulp.dest("dist/"));
    done();
});

gulp.task("sass", function () {
    return gulp
        .src("src/scss/style.scss")
        .pipe(
            sass({
                includePaths: "node_modules/foundation-sites/scss",
                outputStyle: "compact",
            }).on("error", sass.logError)
        )
        .pipe(autoprefixer())
        .pipe(
            stripCSSComments({
                preserve: false,
            })
        )
        .pipe(removeEmptyLines())
        .pipe(gulp.dest("dist/css"));
});

gulp.task("transpile", function () {
    return gulp
        .src(["dist/js/**.js", "!dist/js/vendor/**.js"])
        .pipe(
            babel({
                compact: false,
                presets: ["@babel/env"],
            })
        )
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("cssmin", function () {
    return gulp
        .src("dist/css/**/**.css")
        .pipe(
            cssmin({
                advanced: true,
                aggressiveMerging: false,
                keepSpecialComments: 0,
                roundingPrecision: -1,
                shorthandCompacting: false,
            })
        )
        .pipe(gulp.dest("dist/css/"));
});

gulp.task("jsmin", function () {
    return gulp
        .src("dist/js/**/**.js")
        .pipe(uglify())
        .on("error", function (error) {
            gutil.log(gutil.colors.red("[Error]"), error.toString());
        })
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("uncss", function () {
    return gulp
        .src("dist/css/**/**.css")
        .pipe(
            uncss({
                html: ["src/index.html"],
            })
        )
        .pipe(gulp.dest("css"));
});

gulp.task("bump", function () {
    return gulp
        .src("package.json")
        .pipe(bump({ type: "minor" }))
        .pipe(gulp.dest("./"));
});

gulp.task("patch", function () {
    return gulp
        .src("package.json")
        .pipe(bump({ type: "patch" }))
        .pipe(gulp.dest("./"));
});

gulp.task("archive", function () {
    var timestamp = new Date().toJSON().slice(0, -5).replace(/:|T/g, "-");
    return gulp
        .src("dist/**/**")
        .pipe(zip(npmPackage.name + ".[" + timestamp + "].zip"))
        .pipe(gulp.dest("."));
});

gulp.task("serve", function (done) {
    browserSync.init({
        browser: "google chrome",
        server: {
            baseDir: "./dist/",
        },
    });
    done();
});

gulp.task("reload", function (done) {
    browserSync.reload();
    done();
});

gulp.task("build", function (done) {
    runSequence("clean", "sass", "copy", done);
});

gulp.task("release", function (done) {
    runSequence(
        "clean",
        "sass",
        "copy",
        "transpile",
        "cssmin",
        "uncss",
        "jsmin",
        done
    );
});

gulp.task("default", function (done) {
    runSequence("build", "serve", done);
    gulp.watch(["src/**/**/**"], gulp.series("build", "reload"));
});
