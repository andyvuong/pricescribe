/*
 * A project setup will consist of a package.json that is used by npm to store metadata for npm modules and grunt.
 * gruntfile.js is used to configure or define tasks
 * Both files should be in the same directory
 *
 * The gruntfile consists of a 
 */

module.exports = function(grunt) {

  // load pre-built plugins that provides configurable tasks: http://gruntjs.com/configuring-tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch'); // runs tasks whenever file changes
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Project and task configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compass: {
      dev: { // specify name of task target ~ compass:dev (can make multiple targets for custom config)
        options: { // (used to override default options) run compass using external config
          config: 'config.rb'
        }
      }
    },
    watch: { // task used to watch for changes and run other changes
      options: { livereload: true }, // included by default in this package
      sass: {
        files: ['_sass/*.scss'], // watch these
        tasks: ['compass:dev'] // run this task
      }
    },
    express: { // run the express server as a task
      options: {
      },
      dev: {
        options: {
          script: 'server.js'
        }
      }
    }
  });

  // register tasks (this runs when you use 'grunt' on the command line)
  // setting 'default' to another name and using 'grunt <name>' will register those tasks
  grunt.registerTask('default', ['express:dev', 'watch']);
};