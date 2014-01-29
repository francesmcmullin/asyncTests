var justWait = require('promise-to-test').justWait;
var waitFor = require('promise-to-test').waitFor;
var chai = require('chai');
var doTheStuff = require('../index');
var sinon = require('sinon');
var Q = require('q');

describe("Initial Async", function(){
  beforeEach(function() {
    if(!console.log.restore) sinon.spy(console, "log")
  });

  afterEach(function(){
    if(console.log.restore) console.log.restore();
  });

  var ajax = function(url, callback){
    var res = justWait(100).then(function(){
      res.data = "bleep bloop!";
      return {data: res.data};
    })
    return res.nodeify(callback);
  }

  it("calls the ajax", function(done){
    var called = false
    var ajax = function(url, callback){
      called = true
      return Q({data:"yay!"}).nodeify(callback);
    }

    doTheStuff(ajax)
    waitFor(function(){
      chai.assert.ok(called, "ajax not called")
    }, 300)
    .then(function(){done()}, done);
  })

  it("calls the ajax and then logs the result", function(done){
    doTheStuff(ajax);

    waitFor(function(){
      chai.assert.ok(console.log.calledWith("bleep bloop!"), "result was not logged");
    }, 500)
    .then(function(){done()}, done);
  })

  it("uses the callback instead of looping", function(done){
    sinon.spy(global, "setTimeout");
    sinon.spy(global, "setInterval");

    doTheStuff(ajax);
    chai.assert.ok(global.setTimeout.callCount < 2, "setTimeout still in use");
    chai.assert.ok(global.setTimeout.callCount < 2, "setInterval still in use");

    waitFor(function(){
      chai.assert.ok(console.log.calledWith("bleep bloop!"), "result was not logged");
    }, 500)
    .then(function(){done()}, done);
  })
});
