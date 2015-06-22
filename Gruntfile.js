module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      ngVimeo: {
        files: {
          'dist/<%= pkg.name %>.js': ['src/ngVimeo.js', 'src/player/player.js']
        }
      }
    },
    uglify: {
      options: {
        sourceMap: true,
        compress: true
      },
      my_target: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.registerTask('default', ['ngAnnotate', 'uglify']);

};
