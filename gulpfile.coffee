gulp = require 'gulp'
coffee = require 'gulp-coffee'
del = require 'del'
print = require 'gulp-print'
util = require 'gulp-util'
sourcemaps = require 'gulp-sourcemaps'

gulp.task 'clean', (callback) ->
  del [
    'dist/**/*'
    'spec/**/*.js'
    'spec/**/*.map'
  ], callback

gulp.task 'build', ['clean'], ->
  gulp.src 'src/**/*.coffee'
  .pipe print (path) ->
    return "source: #{ path }"
  .pipe sourcemaps.init()
  .pipe coffee().on 'error', (error) ->
    util.log error
    @emit 'end'
  .pipe sourcemaps.write './',
    includeContent: false
    sourceRoot: '../src'
    sourceMappingURLPrefix: './'
  .pipe print (path) ->
    return "output: #{ path }"
  .pipe gulp.dest 'dist'

gulp.task 'build-tests', ['clean'], ->
  gulp.src 'spec/**/*.coffee'
  .pipe print (path) ->
    return "source: #{ path }"
  .pipe sourcemaps.init()
  .pipe coffee().on 'error', (error) ->
    util.log error
    @emit 'end'
  .pipe sourcemaps.write './',
    includeContent: false
    sourceRoot: '../src'
    sourceMappingURLPrefix: './'
  .pipe print (path) ->
    return "output: #{ path }"
  .pipe gulp.dest 'spec'

gulp.task 'watch', ['build', 'build-tests'], ->
  gulp.watch [
    'src/**/*.coffee'
    'spec/**/*.coffee'
  ], [
    'build'
    'build-tests'
  ]

gulp.task 'default', ['build', 'build-tests']