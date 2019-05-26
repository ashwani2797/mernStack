const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const service = require('./../../server/helpers/codeForTest');


Given('user name is {string}', function (givenName) {
    this.name = givenName;
});

When('I try to authorize user john', function () {
    this.actualAnswer = service.isUserJohnAuthorized(this.name);
});

Then('I should get {string}', function (expectedAnswer) {
    assert.equal(this.actualAnswer, expectedAnswer);
});