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
      // Project scaffold details
      {
        name: 'newJavaScriptModules',
        message: 'What empty JavaScript modules would you like created? (comma separate)',
        default: 'global'
      },
      {
        name: 'newPages',
        message: 'What empty pages would you like created? (comma separate)',
        default: 'home'
      },
      // @todo Add options to include our prebuilt JS modules
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

      // Project scaffold
      self.newJavaScriptModules = props.newJavaScriptModules.split(',');
      self.newPages = props.newPages.split(',');

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
      dependencies: {}
    };

    if (self.supportLegacy) {
      bower.dependencies.jquery = '~1.11.1';
    } else {
      bower.dependencies.jquery = '~2.1.1';
    }

    if (self.useModernizr) {
      bower.dependencies.modernizr = 'latest';
    }

    self.write('.bowerrc', JSON.stringify(bowerrc, null, 2));
    self.write('bower.json', JSON.stringify(bower, null, 2));
  },

  package: function () {
    var self = this;

    // Copy Package file over
    // @todo: scaffold package
    self.template('_package.json', 'package.json');
  },

  gruntfile: function () {
    var self = this;

    // Copy Gruntfile over
    // @todo: scaffold gruntfile
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
    self.directory('assets/scripts/', 'app/src/assets/scripts/');

    // Create modules for each item from the user defined list
    // @todo  Invoke sub generator and remove duplication remove duplication ↓
    // self.invoke(
    // 'bb-project:script',
    // {
    //   options: {
    //     nested: true,
    //     newJavaScriptModules: self.newJavaScriptModules
    //   }
    // });
    self.newJavaScriptModules.forEach(function (module) {
      self.moduleName = changeCase.camelCase(module);
      self.template('_module.js', 'app/src/assets/scripts/modules/combine/' + module + '.js');
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

        // Save .yo-rc.json
        this.config.save();
        this.config.set('generated', self.currentDateTime);
      }.bind(this)
    });
  }
});

module.exports = BbProjectGenerator;
