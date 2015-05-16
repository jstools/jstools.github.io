var grunt = require('grunt'),
    compile = require('jengine-template').compile,
    Scope = require('jengine-scope'),
    UglifyJS = require("uglify-js"),

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

function jengineNoPrefix (name) {
  return name.replace(/^jengine-/,'');
}

var env = new Scope({
  href: function () {
    return 'http://example.com';
  },
  pkg: grunt.file.readJSON('package.json'),
  bower: grunt.file.readJSON('bower.json'),
  jengineNoPrefix: jengineNoPrefix
});
env.host = env.pkg.homepage;
env.jengineTools = Object.keys(env.bower.devDependencies).filter(function (value) {
  return value !== 'jengine';
});

module.exports = function (options) {
  options = options || {};

  if( options.debug ) {
    env.host = '//localhost:8080';
    env.debug = true;
  }

  var layout = template('layout');

  grunt.file.write('index.html', layout(env.$$new({
    article: template('welcome')({
      welcome: marked( grunt.file.read('templates/welcome.md') )
    })
  })) );

  grunt.file.write('public/assets/jEngine.min.js', grunt.file.read( joinPath( bowerDependencies.dependenciesPath ,'jengine', 'jEngine.min.js' ) ) );
  grunt.file.write('public/assets/fastclick.min.js', UglifyJS.minify( joinPath( bowerDependencies.dependenciesPath ,'fastclick', 'lib/fastclick.js' ) ).code );

  bowerDependencies.each(['README.md', 'package.json'], function (dependence, readme, pkg) {
    var pagePath = ( dependence === 'jengine' ) ?
        joinPath( 'jengine', 'index.html' ) :
        joinPath( 'jengine', jengineNoPrefix(dependence), 'index.html' );

    grunt.file.write(
      pagePath,
      layout(env.$$new({
        dependence: dependence,
        article: marked(readme),
        githubUrl: pkg.homepage
      }))
    );
  }, {
    src: 'devDependencies'
  });
  // console.log( template('layout')(env), bower );
};
