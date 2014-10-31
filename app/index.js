'use strict';

var yeoman = require('yeoman-generator'),
yosay = require('yosay');

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
      // Install details
      {
        name: 'componentDir',
        message: 'Where do you want Bower components installed?',
        default: 'components'
      },
      {
        type: 'list',
        name: 'supportLegacy',
        message: 'Do you need to support legacy IE versions?',
        choices: ['yes', 'no'],
        default: 'no'
      },
      {
        type: 'list',
        name: 'includeLess',
        message: 'Do you want to include our Less modules?',
        choices: ['yes', 'no'],
        default: 'yes'
      },
      {
        type: 'list',
        name: 'includeModernizr',
        message: 'And you\'re using Modernizr, right?',
        choices: ['yes', 'no'],
        default: 'yes'
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
      self.projectName = props.projectName;
      self.projectVersion = props.projectVersion;

      // Install
      self.componentDir = props.componentDir;
      self.supportLegacy = props.supportLegacy;
      self.includeLess = props.includeLess;
      self.includeModernizr = props.includeModernizr;
      self.newJavaScriptModules = props.newJavaScriptModules.split(',');
      self.pages = props.pages.split(',');

      var javaScriptModules = props.javaScriptModules;

      function hasFeature (feat) {
        return javaScriptModules && javaScriptModules.indexOf(feat) !== -1;
      }

      self.includeGlobal = hasFeature('includeGlobal');
      self.includeMenu = hasFeature('includeMenu');
      console.log('blah');
      // Misc details
      self.currentYear = new Date().getFullYear();

      done();
    }.bind(this));
},

writing: {
  app: function () {
    this.dest.mkdir('app');
    this.dest.mkdir('app/templates');

    this.src.copy('_package.json', 'package.json');
    this.src.copy('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.src.copy('editorconfig', '.editorconfig');
    this.src.copy('jshintrc', '.jshintrc');
  }
},

end: function () {
  this.installDependencies();
}
});

module.exports = BbProjectGenerator;
