module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        mangle: true
      },
      build: {
        files: {
          'dist/vendor.bundle.js': 'dist/vendor.bundle.js',
          'dist/main.bundle.js': 'dist/main.bundle.js',
          'dist/0.chunk.js': 'dist/0.chunk.js',
          'dist/1.chunk.js': 'dist/1.chunk.js',
          'dist/2.chunk.js': 'dist/2.chunk.js',
          'dist/inline.bundle.js': 'dist/inline.bundle.js',
          'dist/polyfills.bundle.js': 'dist/polyfills.bundle.js',
          'dist/styles.bundle.js': 'dist/styles.bundle.js',
        }
      }
    },
    useminPrepare: {
      html: 'dist/index.html',
      options: {
        dest: 'dist',
        flow: {
          html: {
            steps: {
              js: ['uglifyjs']
            },
            post: {}
          }
        }
      }
    },
    usemin: {
      html: ['dist/index.html'],
      js: ['dist/{,*/}*.js'],
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-usemin');

  // Default task(s).
  grunt.registerTask('default', ['useminPrepare', 'uglify', 'usemin']);

};