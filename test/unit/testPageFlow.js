var expect = require("chai").expect;
var pageUtil = require("../../app/pageFlow.js");

describe("Next page flow", function () {

  before(function () {
    pageUtil.list = ['currentPage', 'nextPage'];
  });

  it("Returns the next page", function () {
    expect(pageUtil.getNextPage('currentPage')).to.equal('nextPage');
  });
});