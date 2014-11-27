'use strict';

var yeoman = require('yeoman-generator'),
yosay = require('yosay'),
slug = require('slug'),
changeCase = require('change-case');

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
      'Generate a blank JavaScript module. Go ahead, try it...'
      ));

    var prompts = [
      // Personal details
      {
        name: 'yourName',
        message: 'What is your name?',
        default: 'Building Blocks'
      },
      {
        name: 'yourUrl',
        message: 'What is your website URL?',
        default: 'http://building-blocks.com'
      },
      // Project details
      {
        name: 'projectVersion',
        message: 'What version of your project is this?',
        default: '0.0.1'
      },
      // Module details
      {
        name: 'newJavaScriptModules',
        message: 'What empty JavaScript modules would you like created? (comma separate)',
        default: 'global'
      }
      ];

      this.prompt(prompts, function (props) {

      // Personal
      self.yourName = props.yourName;
      self.yourUrl = props.yourUrl;

      // Project
      self.projectVersion = props.projectVersion;

      // Project scaffold
      self.newJavaScriptModules = props.newJavaScriptModules.split(',');

      done();
    }.bind(this));
    },

  // Scaffold project
  scripts: function () {
    var self = this;

    // Create modules for each item from the user defined list
    self.newJavaScriptModules.forEach(function (module) {
      self.moduleName = changeCase.camelCase(module);
      self.template('_module.js', 'src/assets/scripts/modules/combine/' + module + '.js');
    });
  },

  // Callbacks for after scaffolding
  end: function () {
    this.log(yosay(
      'All done! now write some JavaScript!'
      ));
  }
});

module.exports = BbProjectGenerator;
