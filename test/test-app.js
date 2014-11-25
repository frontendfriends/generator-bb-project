/*global describe, beforeEach, it*/
'use strict';

var path = require('path'),
assert = require('yeoman-generator').assert,
helpers = require('yeoman-generator').test,
os = require('os');

describe('bb-project:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
    .inDir(path.join(os.tmpdir(), './temp-test'))
    .withOptions({ 'skip-install': true })
    .withPrompt({
      someOption: true
    })
    .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      // @todo Add more files to test
      '.bowerrc',
      'bower.json',
      'package.json',
      '.editorconfig',
      '.jshintrc'
      ]);
  });
});
