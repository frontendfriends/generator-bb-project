/**
 * @file Gruntfile
 * @version 0.1.0
 * @author {@link https://github.com/furzeface Daniel Furze}
 */

module.exports = function(grunt) {
  'use strict';
  /* jshint camelcase: false */

  // Reads package.json and dynamically loads all Grunt tasks
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies', pattern: ['grunt-*']});

  // Time all of the things
  require('time-grunt')(grunt);

  // Go!
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/* <%= pkg.name %> :: Latest build: <%= grunt.template.today(\'dd/mm/yyyy, h:MM:ss TT\') %> */\n'
      // @todo Use banner for index.js on build
    },
    config: {
      generators: 'generators',
      app: 'app',
      test: 'test',
      index: 'index.js',
      templates: 'templates',
      styles: 'styles',
      scripts: 'scripts',
      images: 'images',
      gruntfile: 'Gruntfile.js'
    },


    // Watchers
    watch: {
      gruntfile: {
        files: [
          '<%= config.gruntfile %>'
        ],
        tasks: [
          'jshint:gruntfile'
        ]
      },
      app: {
        files: [
          '<%= config.app %>/<%= config.index %>',
        ],
        tasks: [
          'build_app'
        ]
      },
      test: {
        files: [
          '<%= config.test %>/**/*.js',
        ],
        tasks: [
          'mochaTest'
        ]
      }
    },


    // Project tasks
    todo: {
      options: {
        colophon: true,
        file: 'TODO.md',
        marks: [{
                name: 'todo',
                pattern: /@(todo)/i,
                color: 'blue'
            }],
            title: '[<%= pkg.title%> TODO list:](<%= pkg.homepage %>)',
          usePackage: true
      },
      all: [
        '<%= config.generators %>/**/*.{js,hbs,txt}',
        '<%= config.test %>/**/*.js',
        '<%= config.gruntfile %>'
      ]
    },


    // Script tasks
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      app: [
        '<%= config.app %>/<%= config.index %>'
      ],
      gruntfile: [
        '<%= config.gruntfile %>'
      ]
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'nyan',
          quiet: false
        },
        src: [
        '<%= config.test %>/**/*.js'
        ]
      }
    }
  });


  // Task aliases.
  grunt.registerTask('build_app', [
    'newer:jshint:app'/*,
    'newer:mochaTest'*/
  ]);


  // Default task.
  grunt.registerTask('default', [
    'build_app',
    'watch'
  ]);

  // CI build task.
  grunt.registerTask('travis', [
    'build_app'
  ]);
};
