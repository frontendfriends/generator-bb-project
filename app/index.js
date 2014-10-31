'use strict';

var yeoman = require('yeoman-generator'),
yosay = require('yosay'),
slugify = require('slugify');

var BbProjectGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    var self = this;

    self.pkg = require('../package.json');
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
        message: 'First a bit about you. What is your name?',
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
        name: 'newJavaScriptModules',
        message: 'What empty JavaScript modules would you like created? (comma separate)',
        default: 'global'
      },
      {
        type: 'checkbox',
        name: 'javaScriptModules',
        message: 'What prebuilt JavaScript modules would you like to include?',
        choices: [
        {
          name: 'Menu',
          value: 'includeMenu',
          checked: true
          // @todo Add moar of our prebuilt JS modules
        }
        ]
      },
      {
        name: 'pages',
        message: 'What empty pages would you like created? (comma separate)',
        default: 'home,about,work'
      }
      ];

      this.prompt(prompts, function (props) {
      // Personal
      self.yourName = props.yourName;
      self.yourEmail = props.yourEmail;
      self.yourUrl = props.yourUrl;
      self.yourGitUser = props.yourGitUser;

      // Project
      self.projectName = slugify(props.projectName);
      self.projectVersion = props.projectVersion;

      if (props.gitRepository === 'Bitbucket') {
        self.gitRepository = 'https://bitbucket.org/buildingblocks/' + self.projectName;
      } else if (props.gitRepository === 'GitHub') {
        self.gitRepository = 'https://github.com/buildingblocks/' + self.projectName;
      }

      // Install
      self.componentDir = props.componentDir;
      self.supportLegacy = props.supportLegacy;
      self.newJavaScriptModules = props.newJavaScriptModules.split(',');
      self.pages = props.pages.split(',');

      var javaScriptModules = props.javaScriptModules;

      function hasFeature (feat) {
        return javaScriptModules && javaScriptModules.indexOf(feat) !== -1;
      }

      self.includeGlobal = hasFeature('includeGlobal');
      self.includeMenu = hasFeature('includeMenu');

      // Misc details
      self.currentYear = new Date().getFullYear();

      done();
    }.bind(this));
  },

  // Scaffold project
  bower: function () {
    var self = this,
    bower = {
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

    if (self.supportLegacy === 'yes') {
      bower.dependencies.jquery = '~1.11.1';
    } else {
      bower.dependencies.jquery = '~2.1.1';
    }

    bower.dependencies.modernizr = 'latest';

    self.template('bowerrc', '.bowerrc');
    self.write('bower.json', JSON.stringify(bower, null, 2));
  },

  package: function () {
    var self = this;

    self.template('_package.json', 'package.json');
  },

  projectMeta: function () {
    var self = this;

    self.template('_site.sublime-project', '_<%= projectName %>.sublime-project');
    self.src.copy('editorconfig', '.editorconfig');
    self.template('gitignore', '.gitignore');
    self.template('gitattributes', '.gitattributes');
    self.template('_AUTHORS.md', 'AUTHORS.md');
    self.template('_README.md', 'README.md');
  },

  directories: function () {
    var self = this;

    self.dest.mkdir('app/src/assets');
    self.dest.mkdir('app/src/_bb');
    self.dest.mkdir('app/src/fonts');
    self.dest.mkdir('app/src/images');
    self.dest.mkdir('app/src/assets/scripts');
    self.dest.mkdir('app/src/assets/styles');
    self.dest.mkdir('app/src/assets/temp');
    self.dest.mkdir('app/src/assets/templates');

    self.dest.mkdir('app/src/data');
    self.dest.mkdir('app/src/helpers');
    self.dest.mkdir('app/src/layouts');
    self.dest.mkdir('app/src/pages');
    self.dest.mkdir('app/src/partials');
  },

  scripts: function () {
    var self = this;

    self.src.copy('jscsrc', '.jscsrc');
    self.src.copy('jsdoc.conf.json', '.jsdoc.conf.json');
    self.src.copy('jshintrc', '.jshintrc');
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = BbProjectGenerator;
