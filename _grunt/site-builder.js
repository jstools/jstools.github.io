var grunt = require('grunt'),
    compile = require('jstools-compile'),
    Scope = require('jstools-scope'),
    joinPath = require('path').join,
    cwdPath = function(path) {
      var paths = [process.cwd()];
      [].push.apply(paths, arguments);
      return joinPath.apply( null, paths );
    },
    bowerDependencies = require('package-manager')('bower'),
    marked = require('marked');

function template (path) {
  if( template.cache[path] ) {
    return template.cache[path];
  }

  if( grunt.file.isFile( cwdPath('templates', path) + '.html' ) ) {
    template.cache[path] = compile( grunt.file.read( cwdPath('templates', path) + '.html' ) );
    return template.cache[path];
  }

  return template.notFound;
}
template.cache = {};
template.notFound = compile('[not found]');

var env = new Scope({
  href: function () {
    return 'http://example.com';
  },
  pkg: grunt.file.readJSON('package.json'),
  bower: grunt.file.readJSON('bower.json'),
  jstoolLabel: function (name) {
    return name.replace(/^jstools-/,'');
  }
});
env.host = env.pkg.homepage;

module.exports = function (options) {
  options = options || {};
  if( options.debug ) {
    env.host = '//localhost:8080';
    env.debug = true;
  }

  var layout = template('layout');

  grunt.file.write('index.html', layout(env) );
  grunt.file.write('page/jengine/index.html', layout(env) );

  bowerDependencies.each(['README.md', 'package.json'], function (dependence, readme, pkg) {
    grunt.file.write(
      joinPath( 'page/jengine', dependence, 'index.html' ),
      layout(env.$$new({ dependence: dependence, article: marked(readme), githubUrl: pkg.homepage }))
    );
  });
  // console.log( template('layout')(env), bower );
};
