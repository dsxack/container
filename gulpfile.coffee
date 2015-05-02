gulp = require "gulp"
coffee = require "gulp-coffee"
del = require "del"
print = require "gulp-print"
util = require "gulp-util"
concat = require "gulp-concat"
sourcemaps = require "gulp-sourcemaps"
jasmine = require "gulp-jasmine"

gulp.task "clean", (callback) ->
  del [
    "dist/**/*"
    "spec/**/*.js"
    "spec/**/*.map"
  ], callback

gulp.task "build", ["clean"], ->
  gulp.src "src/**/*.coffee"
  .pipe print (path) ->
    return "source: #{ path }"
  .pipe sourcemaps.init()
  .pipe concat("container")
  .pipe coffee().on "error", (error) ->
    util.log error
    @emit "end"
  .pipe sourcemaps.write "./",
    includeContent: false
    sourceRoot: "../src"
    sourceMappingURLPrefix: "./"
  .pipe print (path) ->
    return "output: #{ path }"
  .pipe gulp.dest "dist"

gulp.task "test", ["build"], ->
  gulp.src "spec/**/*Spec.coffee"
    .pipe jasmine()

gulp.task "watch", ["build", "build-tests"], ->
  gulp.watch [
    "src/**/*.coffee"
    "spec/**/*.coffee"
  ], [
    "build"
    "build-tests"
  ]

gulp.task "default", ["build", "test"]