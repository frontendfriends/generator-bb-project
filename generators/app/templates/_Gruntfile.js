module.exports = function(grunt) {
  'use strict';
  /* jshint camelcase: false */

  // Reads package.json and dynamically loads all Grunt tasks
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies',
    pattern: ['assemble', 'grunt-*']
  });

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowerrc: grunt.file.readJSON('.bowerrc'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> */ \n'
    },

    config: {
      gruntfile: 'Gruntfile.js',
      // component settings
      bower: '<%= bowerrc.directory %>',
      // src settings
      src: 'app/src',
      srcAssets: 'assets',
      srcStyles: 'styles',
      srcScripts: 'scripts',
      srcTemp: 'temp',
      srcImages: 'images',
      srcFonts: 'fonts',
      // dist settings
      dist: 'app/dist',
      distStyles: 'styles',
      distScripts: 'scripts',
      distTemp: 'temp',
      distImages: 'images',
      distFonts: 'fonts',
      // misc settings
      pagePrefix: '<%= pkg.name %>_',
      partialPrefix: '<%= pkg.name %>_partial-',
      helpers: 'helpers',
      assembleExt: 'hbs',
      mainCss: 'main.css',
      ieCss: 'ie.css',
      mainRtlCss: 'main.rtl.css',
      ieRtlCss: 'ie.rtl.css',
      livereloadPort: function () {
        var min = 35729,
        max = min + 1000,
        port = Math.floor(Math.random() * (max - min + 1)) + min;
        return port;
      }
    },


    // Watchers
    watch: {
      gruntfile: {
        files: [
        '<%= jshint.gruntfile.src %>'
        ],
        tasks: [
        'jshint:gruntfile'
        ]
      },
      html: {
        files: [
        '<%= config.src %>/{data,pages,partials,layouts}/**/*.{<%= config.assembleExt %>,yml,json}'
        ],
        tasks: [
        'build_html'
        ]
      },
      scripts: {
        files: [
        '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/**/**.js',
        ],
        tasks: [
        'build_scripts',
        'modernizr'
        ]
      },
      styles: {
        files: [
        '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/*.css',
        '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/*.less',
        '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/_mixins/mixins-*.less'
        ],
        tasks: [
        'build_styles',
        'modernizr'
        ]
      },
      livereload: {
        options: {
          livereload: parseInt('<%= config.livereloadPort %>',10)
        },
        files: [
        '<%= config.dist %>/**/*.html',
        '<%= config.dist %>/<%= config.distAssets %>/**/*.{css,js,png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },


    // Project tasks
    copy: {
      bb: {
        files: [
        {
          expand: true,
          cwd: '<%= config.src %>/<%= config.srcAssets %>/_bb/',
          src: ['**'],
          dest: '<%= config.dist %>/_bb'
        }
        ]
      },
      assets: {
        files: [
        {
          expand: true,
          cwd: '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcImages %>/',
          src: ['**'],
          dest: '<%= config.dist %>/<%= config.distImages %>/'
        },
        {
          expand: true,
          cwd: '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcFonts %>/',
          src: ['**'],
          dest: '<%= config.dist %>/<%= config.distStyles %>/<%= config.distFonts %>/'
        },
        {
          expand: true,
          cwd: '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcTemp %>/',
          src: ['**'],
          dest: '<%= config.dist %>/<%= config.distTemp %>/'
        }
        ]
      },
      scripts: {
        files: [
        {
          expand: true,
          cwd: '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/modules/',
          src: ['*.js'],
          dest: '<%= config.dist %>/<%= config.distScripts %>/'
        }
        ]
      },
      styles: {
        files: [
        {
          expand: true,
          cwd: '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/',
          src: ['*.css'],
          dest: '<%= config.dist %>/<%= config.distStyles %>/'
        }
        ]
      },
      normalize: {
        files: [
        {
          expand: true,
          cwd: '<%= config.bower %>/normalize-less',
          src: ['normalize.less'],
          dest: '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less',
        }
        ]
      },
      deploy: {
        files: [
        {
          expand: true,
          cwd: '<%= config.dist %>/',
          src: ['**'],
          dest: '<%= grunt.option(\'dest\') %>'
        }
        ]
      }
    },

    clean: {
      production: [
      '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>.map'
      ],
      html: [
      '<%= config.dist %>/*.html'
      ],
      scripts: [
      '<%= config.dist %>/<%= config.distScripts %>'
      ],
      styles: [
      '<%= config.dist %>/<%= config.distStyles %>'
      ],
      mixins: [
      '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/_mixins/_combined.less'
      ],
      everything: [
      '<%= config.dist %>'
      ],
      deploy: []
    },

    connect: {
      server: {
        options: {
          port: 0,
          livereload: true,
          useAvailablePort: true,
          // change this to '0.0.0.0' to access the server from outside
          hostname: 'localhost',
          open: true,
          base: '<%= config.dist %>'
        }
      }
    },


    // HTML build tasks
    assemble: {
      options: {
        flatten: false,
        layout: false,
        partials: [
        '<%= config.src %>/partials/**/*.<%= config.assembleExt %>',
        '<%= config.src %>/layouts/**/*.<%= config.assembleExt %>'
        ],
        helpers: [
        '<%= config.src %>/<%= config.helpers %>/helper-*.js'
        ],
        assets: '<%= config.dist %>',
        images: '<%= config.distImages %>',
        styles: '<%= config.distStyles %>',
        scripts: '<%= config.distScripts %>',
        temp: '<%= config.distTemp %>',
        mainCss: '<%= config.mainCss %>',
        mainRtlCss: '<%= config.mainRtlCss %>',
        ieCss: '<%= config.ieCss %>',
        ieRtlCss: '<%= config.ieRtlCss %>',
        data: [
        '<%= config.src %>/data/*.json',
        'package.json',
        ],
        timestamp: '<%= grunt.template.today("mmm dS yyyy, h:MMtt Z") %>'
      },
      pages: {
        files: [{
          expand: true,
          cwd: '<%= config.src %>/pages/',
          src: '**/*.<%= config.assembleExt %>',
          dest: '<%= config.dist %>/',
          rename: function(dest, src) {
            var filename = src;
            if (src.substring(0, 1) === '_') {
              filename = dest + src.substring(1);
            } else if(src.indexOf('/') !== -1) {
              var index = null,
              splitSrc = src.split('/');
              filename = dest + '<%= config.pagePrefix %>';
              for (index = 0; index < splitSrc.length; ++index) {
                filename = filename + splitSrc[index];
                if (src.indexOf('.<%= config.assembleExt %>')) {
                  filename = filename + '-';
                }
              }
            } else {
              filename = dest + '<%= config.pagePrefix %>' + src;
            }
            return filename;
          }
        }]
      },
      components: {
        files: [{
          expand: true,
          cwd: '<%= config.src %>/partials/',
          src: '**/*.<%= config.assembleExt %>',
          dest: '<%= config.dist %>/',
          rename: function(dest, src) {
            var filename = src;
            if (src.substring(0, 1) === '_') {
              filename = dest + src.substring(1);
            } else if(src.indexOf('/') !== -1) {
              var splitSrc = src.split('/');
              filename = dest + '<%= config.partialPrefix %>' + splitSrc.pop();
            } else {
              filename = dest + '<%= config.partialPrefix %>' + src;
            }
            return filename;
          }
        }]
      }
    },


    // Script tasks
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
      '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/modules/**/*.js',
      '<%= config.gruntfile %>'
      ],
      gruntfile: {
        src: '<%= config.gruntfile %>'
      }
    },

    jscs: {
      options: {
        config: '.jscsrc',
        requireCurlyBraces: [ 'if' ]
      },
      scripts: [
      '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/modules/**/*.js'
      ]
    },

    concat: {
      lessMixins: {
        src: [
        '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/_mixins/*.less'
        ],
        dest: '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/_mixins/_combined.less'
      },
      jquery: {
        src: [
        '<%= config.bower %>/jquery/dist/jquery.js'
        ],
        dest: '<%= config.dist %>/<%= config.distScripts %>/jquery.js'
      },
      scripts: {
        src: [
        '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/plugins/combine/*.js',
        '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/modules/combine/*.js',
        '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/_init.js'
        ],
        dest: '<%= config.dist %>/<%= config.distScripts %>/scripts.js'
      },
      ieScripts: {
        src: [
        '<%= config.bower %>/nwmatcher/src/nwmatcher.js',
        '<%= config.bower %>/selectivizr/selectivizr.js'
        ],
        dest: '<%= config.dist %>/<%= config.distScripts %>/ie.js'
      },
      validation: {
        src: [
        '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/validation/*.js'
        ],
        dest: '<%= config.dist %>/<%= config.distScripts %>/validation.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>',
        preserveComments: 'some',
        mangle: true,
        compress: {
          drop_console: true
        }
      },
      jquery: {
        src: '<%= config.dist %>/<%= config.distScripts %>/jquery.js',
        dest: '<%= config.dist %>/<%= config.distScripts %>/jquery.js'
      },
      scripts: {
        src: '<%= config.dist %>/<%= config.distScripts %>/scripts.js',
        dest: '<%= config.dist %>/<%= config.distScripts %>/scripts.js'
      },
      ieScripts: {
        src: '<%= config.dist %>/<%= config.distScripts %>/ie.js',
        dest: '<%= config.dist %>/<%= config.distScripts %>/ie.js'
      }
    },


    // Style tasks
    less: {
      main: {
        options: {
          yuicompress: false,
          sourceMap: true,
          sourceMapFilename: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>.map',
          sourceMapURL: '<%= config.mainCss %>.map',
          sourceMapRootpath: '/'
        },
        files: {
          '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>': '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/_order.less'
        }
      },
      rtl: {
        options: {
          yuicompress: false,
          sourceMap: true,
          sourceMapFilename: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainRtlCss %>.map',
          sourceMapURL: '<%= config.mainRtlCss %>.map',
          sourceMapRootpath: '/'
        },
        files: {
          '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainRtlCss %>': '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/_order.less'
        }
      }
    },

    combine_mq: {
      main: {
        expand: true,
        flatten: true,
        src: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>',
        dest: '<%= config.dist %>/<%= config.distStyles %>/'
      }
    },

    stripmq: {
      ie: {
        files: {
          '<%= config.dist %>/<%= config.distStyles %>/<%= config.ieCss %>': '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>'
        }
      },
      ieRtl : {
        files: {
          '<%= config.dist %>/<%= config.distStyles %>/<%= config.ieRtlCss %>': '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainRtlCss %>'
        }
      }
    },

    cssmin: {
      options: {
        noAdvanced: true,
        compatibility: 'ie8'
      },
      main: {
        src: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>',
        dest: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>'
      },
      mainRtl: {
        src: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainRtlCss %>',
        dest: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainRtlCss %>'
      },
      ie: {
        src: '<%= config.dist %>/<%= config.distStyles %>/<%= config.ieCss %>',
        dest: '<%= config.dist %>/<%= config.distStyles %>/<%= config.ieCss %>'
      },
      ieRtl: {
        src: '<%= config.dist %>/<%= config.distStyles %>/<%= config.ieRtlCss %>',
        dest: '<%= config.dist %>/<%= config.distStyles %>/<%= config.ieRtlCss %>'
      }
    },


    // Misc tasks
    modernizr: {
      dist: {
        'devFile': '<%= config.bower %>/modernizr/modernizr.js',
        'outputFile': '<%= config.dist %>/<%= config.distScripts %>/modernizr.js',
        'parseFiles': true,
        'files': {
          'src': [
          '<%= config.dist %>/<%= config.distScripts %>/*.js',
          '<%= config.dist %>/<%= config.distStyles %>/*.css'
          ]
        },
        'extra' : {
          'shiv' : true,
          'printshiv' : false,
          'load' : true,
          'mq' : false,
          'cssclasses' : true
        },
        'extensibility' : {
          'addtest' : false,
          'prefixed' : false,
          'teststyles' : false,
          'testprops' : false,
          'testallprops' : false,
          'hasevents' : false,
          'prefixes' : false,
          'domprefixes' : false
        }
      }
    },

    // HTML tasks
    prettify: {
      options: {
        'indent': 1,
        'indent_char': '	', // tab
        'indent_scripts': 'normal',
        'wrap_line_length': 0,
        'brace_style': 'collapse',
        'preserve_newlines': true,
        'max_preserve_newlines': 1,
        'unformatted': [
        'code',
        'pre'
        ]
      },
      deploy: {
        expand: true,
        cwd: '<%= config.dist %>/',
        ext: '.html',
        src: ['*.html'],
        dest: '<%= config.dist %>/'
      }
    },

    zip: {
      deploy: {
        cwd: '<%= config.dist %>/',
        src: ['<%= config.dist %>/**/*'],
        dest: 'dist.zip'
      }
    },

    devUpdate: {
      report: {
        options: {
          updateType: 'report',
          reportUpdated: false,
          semver: true,
          packages: {
            devDependencies: true,
            dependencies: false
          },
          packageJson: './package.json'
        }
      },
      prompt: {
        options: {
          updateType: 'prompt',
          reportUpdated: false,
          semver: false,
          packages: {
            devDependencies: true,
            dependencies: true
          },
          packageJson: './package.json'
        }
      },
      force: {
        options: {
          updateType: 'force',
          reportUpdated: false,
          semver: false,
          packages: {
            devDependencies: true,
            dependencies: true
          },
          packageJson: './package.json'
        }
      }
    }
  });

  // Build tasks.
  grunt.registerTask('build_html', [
    'clean:html',
    'assemble',
    'copy:assets'
    ]);

  grunt.registerTask('build_styles', [
    'clean:styles',
    'concat:lessMixins',
    'less',
    'combine_mq',
    'stripmq',
    'copy:styles',
    'copy:assets',
    'clean:mixins'
    ]);

  grunt.registerTask('build_scripts', [
    'clean:scripts',
    // 'jscs',
    'jshint',
    'concat:jquery',
    'concat:scripts',
    'concat:ieScripts',
    'concat:validation',
    'copy:scripts'
    ]);

  grunt.registerTask('build_dev', [
    'build_html',
    'build_scripts',
    'copy:normalize',
    'build_styles',
    'modernizr',
    'copy:bb'
    ]);

  grunt.registerTask('build_production', [
    'build_dev',
    'cssmin',
    'uglify',
    'prettify',
    'clean:production'
    ]);

  // Default.
  grunt.registerTask('default', [
    'clean:everything',
    'build_dev',
    'watch'
    ]);

  grunt.registerTask('server', [
    'clean:everything',
    'build_dev',
    'connect',
    'watch'
    ]);

  // Dev.
  grunt.registerTask('dev', [
    'build_dev'
    ]);

  // Production.
  grunt.registerTask('production', [
    'build_production'
    ]);

  // Deploy.
  grunt.registerTask('deploy', [
    'build_production',
    'copy:deploy',
    'clean:deploy',
    'zip:deploy'
    ]);

};
