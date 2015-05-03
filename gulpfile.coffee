gulp = require "gulp"
coffee = require "gulp-coffee"
del = require "del"
print = require "gulp-print"
util = require "gulp-util"
concat = require "gulp-concat"
sourcemaps = require "gulp-sourcemaps"
jasmine = require "gulp-jasmine"
uglify = require "gulp-uglify"
rename = require "gulp-rename"
p = require "path"
filter = require "gulp-filter"

gulp.task "clean", (callback) ->
  del "dist/**/*", callback

gulp.task "build", ["clean"], ->
  gulp.src "src/**/*.coffee"
  .pipe print (path) -> "source: #{ path }"
  .pipe sourcemaps.init()
  .pipe concat("container")
  .pipe coffee().on "error", (error) ->
    util.log error
    @emit "end"
  .pipe sourcemaps.write "./",
    includeContent: false
    sourceRoot: "../src"
    sourceMappingURLPrefix: "./"
  .pipe gulp.dest "dist"
  .pipe print (path) -> "output: #{ path }"
  .pipe filter "*.js"
  .pipe sourcemaps.init()
  .pipe uglify()
  .pipe rename extname: ".min.js"
  .pipe sourcemaps.write "./",
    includeContent: false
    sourceRoot: "./"
    sourceMappingURLPrefix: "./"
  .pipe gulp.dest "dist"
  .pipe print (path) -> "output: #{ path }"

gulp.task "test", ["build"], ->
  gulp.src "spec/**/*[sS]pec.coffee"
  .pipe print (path) -> "spec: #{ path }"
  .pipe jasmine()

gulp.task "watch", ["build", "test"], ->
  gulp.watch [
    "src/**/*.coffee"
    "spec/**/*.coffee"
  ], [
    "build"
    "test"
  ]

gulp.task "default", ["build", "test"]