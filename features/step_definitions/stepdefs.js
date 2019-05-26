const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const service = require('./../../server/helpers/codeForTest');


Given('user name is {string}', function (givenName) {
    this.name = givenName;
});

When('I ask whether the user is john', function () {
    this.actualAnswer = service.isUserJohn(this.name);
});

Then('I should be told {string}', function (expectedAnswer) {
    assert.equal(this.actualAnswer, expectedAnswer);
});