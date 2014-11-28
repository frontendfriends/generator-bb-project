'use strict';

var yeoman = require('yeoman-generator'),
yosay = require('yosay'),
slug = require('slug'),
changeCase = require('change-case'),
dateFormat = require('dateformat');

var BbProjectGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    var self = this;

    self.pkg = require('../../package.json');
  },

  prompting: function () {
    var self = this,
    done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Hello and a hearty welcome to the fine BBProject generator v' + self.pkg.version + '!'
      ));

    var prompts = [
      // Personal details
      {
        name: 'yourName',
        message: 'What is your name?',
        default: 'Building Blocks'
      },
      {
        name: 'yourEmail',
        message: 'What is your email?',
        default: 'info@building-blocks.com'
      },
      {
        name: 'yourUrl',
        message: 'What is your website URL?',
        default: 'http://building-blocks.com'
      },
      {
        name: 'yourGitUser',
        message: 'What is your Git username?'
      },
      // Project details
      {
        name: 'projectName',
        message: 'Now, what is the name of this project?',
        default: 'bb-project'
      },
      {
        name: 'projectVersion',
        message: 'What version of the project is this?',
        default: '0.1.0'
      },
      {
        type: 'list',
        name: 'gitRepository',
        message: 'Where will the codebase be stored?',
        choices: ['Bitbucket', 'GitHub'],
        default: 'Bitbucket'
      },
      // Install details
      {
        name: 'componentDir',
        message: 'Where do you want Bower components installed?',
        default: 'bower_components'
      },
      {
        type: 'list',
        name: 'supportLegacy',
        message: 'Do you need to support IE 8?',
        choices: ['yes', 'no'],
        default: 'no'
      },
      {
        type: 'list',
        name: 'useModernizr',
        message: 'And you\'re including Modernizr, right?',
        choices: ['yes', 'no'],
        default: 'yes'
      },
      // Package
      {
        type: 'checkbox',
        name: 'npmPackages',
        message: 'What Grunt plugins would you like to include?',
        choices: [
        {
          name: 'grunt-autoprefixer',
          value: 'grunt-autoprefixer',
          checked: true
        },
        {
          name: 'grunt-combine-mq',
          value: 'grunt-combine-mq',
          checked: true
        },
        {
          name: 'grunt-contrib-concat',
          value: 'grunt-contrib-concat',
          checked: true
        },
        {
          name: 'grunt-contrib-cssmin',
          value: 'grunt-contrib-cssmin',
          checked: true
        },
        {
          name: 'grunt-contrib-jshint',
          value: 'grunt-contrib-jshint',
          checked: true
        },
        {
          name: 'grunt-contrib-less',
          value: 'grunt-contrib-less',
          checked: true
        },
        {
          name: 'grunt-contrib-uglify',
          value: 'grunt-contrib-uglify',
          checked: true
        },
        {
          name: 'grunt-dev-update',
          value: 'grunt-dev-update',
          checked: true
          // @todo Set to false when Gruntfile scaffolded dynamically
        },
        {
          name: 'grunt-jscs',
          value: 'grunt-jscs',
          checked: true
          // @todo Set to false when Gruntfile scaffolded dynamically
        },
        {
          name: 'grunt-newer',
          value: 'grunt-newer',
          checked: true
        },
        {
          name: 'grunt-notify',
          value: 'grunt-notify',
          checked: false
        },
        {
          name: 'grunt-prettify',
          value: 'grunt-prettify',
          checked: true
        },
        {
          name: 'grunt-px-to-rem',
          value: 'grunt-px-to-rem',
          checked: true
        },
        {
          name: 'grunt-stripmq',
          value: 'grunt-stripmq',
          checked: true
          // @todo Make optional based on IE support user flag
        },
        {
          name: 'grunt-todo',
          value: 'grunt-todo',
          checked: true
          // @todo Set to false when Gruntfile scaffolded dynamically
        },
        {
          name: 'grunt-zip',
          value: 'grunt-zip',
          checked: true
        }
        ]
      },

      // Scripts
      {
        name: 'newJavaScriptModules',
        message: 'What empty JavaScript modules would you like created? (comma separate)',
        default: 'global'
      },
      // @todo Add options to include our prebuilt JS modules
      // {
      //   type: 'checkbox',
      //   name: 'javaScriptModules',
      //   message: 'What prebuilt JavaScript modules would you like to include?',
      //   choices: [
      //   {
      //     name: 'Menu',
      //     value: 'includeMenu',
      //     checked: true
      //   }
      //   ]
      // },
      // Pages
      {
        name: 'newPages',
        message: 'What empty pages would you like created? (comma separate)',
        default: 'home'
      },
      // Open directory and project in Sublime afterwards?
      {
        type: 'list',
        name: 'openProject',
        message: 'Do you want to open the project after generation?',
        choices: ['yes', 'no'],
        default: 'no'
      }
      ];

      this.prompt(prompts, function (props) {
      // Personal
      self.yourName = props.yourName;
      self.yourEmail = props.yourEmail;
      self.yourUrl = props.yourUrl;
      self.yourGitUser = props.yourGitUser;

      // Project
      self.projectName = slug(props.projectName);
      self.projectVersion = props.projectVersion;

      if (props.gitRepository === 'Bitbucket') {
        self.gitRepository = 'https://bitbucket.org/buildingblocks/' + self.projectName;
      } else if (props.gitRepository === 'GitHub') {
        self.gitRepository = 'https://github.com/buildingblocks/' + self.projectName;
      }

      // Install
      self.componentDir = props.componentDir;
      self.supportLegacy = (props.supportLegacy === 'yes');
      self.useModernizr = (props.useModernizr === 'yes');
      self.npmPackages = props.npmPackages;

      // Project scaffold
      self.newJavaScriptModules = props.newJavaScriptModules.split(',');
      self.newPages = props.newPages.split(',');

      var javaScriptModules = props.javaScriptModules;

      function hasFeature (feat) {
        return javaScriptModules && javaScriptModules.indexOf(feat) !== -1;
      }

      self.includeMenu = hasFeature('includeMenu');

      // Misc details
      self.openProject = (props.openProject === 'yes');
      self.currentDateTime = dateFormat(new Date(), 'mmmm dS, yyyy, h:MM:ss TT');
      self.currentYear = new Date().getFullYear();

      done();
    }.bind(this));
},

  // Scaffold project
  projectMeta: function () {
    var self = this;

    // Copy project meta files over
    self.template('_site.sublime-project', '_<%= projectName %>.sublime-project');
    self.src.copy('editorconfig', '.editorconfig');
    self.template('gitignore', '.gitignore');
    self.template('gitattributes', '.gitattributes');
    self.template('_AUTHORS.md', 'AUTHORS.md');
    self.template('_README.md', 'README.md');
  },

  bower: function () {
    var self = this;

    var bowerrc = {
      'directory': 'app/src/assets/' + self.componentDir,
      'private': true,
      'interactive': false
    };

    var bower = {
      name: self.projectName,
      version: self.projectVersion,
      homepage: self.gitRepository,
      authors: [
      self.yourName + ' (' + self.yourUrl + ')'
      ],
      private: true,
      license: 'MIT',
      ignore: [
      '**/.*',
      'node_modules',
      self.componentDir
      ],
      devDependencies: {}
    };

    if (self.supportLegacy) {
      bower.devDependencies.jquery = '~1.11.1';
    } else {
      bower.devDependencies.jquery = '~2.1.1';
    }

    if (self.useModernizr) {
      bower.devDependencies.modernizr = 'latest';
    }

    self.write('.bowerrc', JSON.stringify(bowerrc, null, 2));
    self.write('bower.json', JSON.stringify(bower, null, 2));
  },

  // @todo Move package file scaffolding to sub generator
  package: function () {
    var self = this;

    // Copy Package file over
    // @todo scaffold package
    // self.template('_package.json', 'package.json');

    // npmPackages
    var packageJson = {
      'name': self.projectName,
      'version': self.projectVersion,
      'private': true,
      'title': self.projectName,
      'description': self.projectName,
      'homepage': self.gitRepository,
      'author': {
        'name': self.yourName,
        'email': self.yourEmail,
        'url': self.yourUrl
      },
      'contributors': [],
      'repository': {
        'type': 'git',
        'url': self.gitRepository
      },
      'issues': self.gitRepository +'/issues',
      'dependencies': {},
      'devDependencies': {
        // Mandatory packages
        'assemble': '^0.4.41',
        'bower': '^1.3.9',
        'grunt': '^0.4.x',
        'grunt-cli': '~0.1.13',
        'grunt-contrib-clean': '^0.6.0',
        'grunt-contrib-connect': '~0.8.0',
        'grunt-contrib-copy': '^0.6.0',
        'grunt-contrib-watch': '^0.6.1',
        'load-grunt-tasks': '^0.6.0',
        'time-grunt': '^1.0.0'
      },
      'scripts': {
        'test': 'grunt deploy'
      }
    };

    // Write optional packages to package.json
    if (self.useModernizr) {
      packageJson.devDependencies['grunt-modernizr'] = '0.6.0';
    }

    self.npmPackages.forEach(function (packageName) {
      packageJson.devDependencies[packageName] = 'latest';

      // If JSHint, include stylish too :D
      if (packageName === 'grunt-contrib-jshint') {
        packageJson.devDependencies['jshint-stylish'] = '1.0.0';
      }
    });

    self.write('package.json', JSON.stringify(packageJson, null, 2));
  },

  gruntfile: function () {
    var self = this;

    // Copy Gruntfile over
    // @todo Scaffold Gruntfile dynamically, then move to a sub generator
    self.src.copy('_Gruntfile.js', 'Gruntfile.js');
  },

  directories: function () {
    var self = this;

    // Create empty directories
    self.dest.mkdir('app/src/assets/fonts');
    self.dest.mkdir('app/src/assets/temp');
    self.dest.mkdir('app/src/assets/templates');
  },

  bb: function () {
    var self = this;

    // Copy all BB assets over
    self.directory('assets/_bb/', 'app/src/assets/_bb/');
  },

  images: function () {
    var self = this;

    // Copy all existing images over
    self.directory('assets/images/', 'app/src/assets/images/');
  },

  scripts: function () {
    var self = this;

    self.src.copy('jscsrc', '.jscsrc');
    self.template('jsdoc.conf.json', '.jsdoc.conf.json');
    self.src.copy('jshintrc', '.jshintrc');
    // Copy all existing scripts over
    // @todo Phase this out, define mandatory scripts and use optionally selected modules too ↓
    self.directory('assets/scripts/', 'app/src/assets/scripts/');

    // Include custom menu module if required
    // @todo Include this when the above is completed
    // if (self.includeMenu) {
    //   self.src.copy('assets/scripts/modules/combine/menu.js', 'app/src/assets/scripts/modules/combine/menu.js');
    // }

    // Create modules for each item from the user defined list
    // @todo  Invoke sub generator and remove duplication remove duplication ↓
    self.newJavaScriptModules.forEach(function (module) {
      self.moduleName = changeCase.camelCase(module);
      self.template('_module.js', 'app/src/assets/scripts/modules/combine/' + slug(module) + '.js');
    });
  },

  styles: function () {
    var self = this;

    // Copy all existing styles over
    // @todo Makes styles configurable
    // @todo Write _order.less dynamically
    // @todo Rename _order.less dynamically
    self.directory('assets/styles/', 'app/src/assets/styles/');
  },

  data: function () {
    var self = this;

    // Copy all existing data files over
    self.directory('data/', 'app/src/data/');
  },

  helpers: function () {
    var self = this;

    // Copy all existing helpers over
    self.directory('helpers/', 'app/src/helpers/');
  },

  layouts: function () {
    var self = this;

    // Copy all existing layouts over
    self.directory('layouts/', 'app/src/layouts/');
  },

  pages: function () {
    var self = this,
    navigationJson = [];

    // Copy all existing pages over
    self.directory('pages/', 'app/src/pages/');

    // Create page template for each item from the user defined list
    self.newPages.forEach(function (page) {
      // Variable to pass into scaffolding
      self.newPageName = page;

      // Build navigation.json
      navigationJson.push({
        'title': page,
        'url': page,
        'id': page + '-page'
      });

      // Create new page template
      self.template('_page.hbs', 'app/src/pages/' + self.newPageName + '.hbs');
    });

    // Write navigation.json from user input pages
    self.write('app/src/data/navigation.json', JSON.stringify(navigationJson, null, 2));
  },

  partials: function () {
    var self = this;

    // Copy all existing partials over
    self.directory('partials/', 'app/src/partials/');
  },

  // Callbacks for after scaffolding
  end: function () {
    var self = this;

    self.installDependencies({
      callback: function () {

        this.log(yosay(
          'All done! Now running `grunt setup` to kick start the project.'
          ));

        // Call grunt to build after dependencies have been installed
        this.spawnCommand('grunt', ['setup']);

        if (self.openProject) {
          // Open the directory and Sublime project
          this.spawnCommand('open', ['.', '_' + self.projectName + '.sublime-project']);
        }

        // Save yo-rc
        this.config.save();
        this.config.set('generated', self.currentDateTime);
      }.bind(this)
    });
  }
});

module.exports = BbProjectGenerator;
