module.exports = function(grunt) {
  var gruntSettings = {
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: [
        'Gruntfile.js',
        'lib/*.js',
        'tests/*.js',
        'index.js'
      ],
    },

    nodeunit: {
      all: ['tests/*.js']
    }
  };

  grunt.initConfig(gruntSettings);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Run all tests
  grunt.registerTask('default', ['jshint', 'nodeunit']);
};