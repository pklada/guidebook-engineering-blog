// dependencies
var gulp = require('gulp'),
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    filter = require('gulp-filter'),
    tag_version = require('gulp-tag-version');

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp minor     # makes v0.1.1 → v0.2.0
 *     gulp major     # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

function inc(importance) {
    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
        // bump the version number in those files
        .pipe(bump({type: importance}))
        // save it back to filesystem
        .pipe(gulp.dest('./'))
        // commit the changed version number
        .pipe(git.commit('bumps package/bower version'))

        // read only one file to get the version number
        .pipe(filter('bower.json'))
        // **tag it in the repository**
        .pipe(tag_version())

}

gulp.task('patch-commit', ['pull'], function() { return inc('patch'); })
gulp.task('minor-commit', ['pull'], function() { return inc('minor'); })
gulp.task('major-commit', ['pull'], function() { return inc('major'); })

var gitPush = function(){
  git.push('origin', 'master', {args: " --tags"}, function (err) {
    if (err) throw err;
  });
}

gulp.task('pull', function(){
  return git.pull('origin', 'master', {args: " --tags"}, function (err) {
    if (err) throw err;
  });
});

gulp.task('patch', ['patch-commit'], gitPush);
gulp.task('minor', ['minor-commit'], gitPush);
gulp.task('major', ['major-commit'], gitPush);

