var justWait = require('promise-to-test').justWait;
var waitFor = require('promise-to-test').waitFor;
var chai = require('chai');
var doTheStuff = require('../index');
var sinon = require('sinon');

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

  it("calls the ajax", function(){
    var called = false
    var ajax = function(url, callback){
      called = true
      var output = Q({data:"yay!"}).nodeify(callback);
      output.data = "yay!";
      return output;
    }

    doTheStuff(ajax)
    chai.assert.ok(called, "ajax not called")
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
    chai.assert.equal(global.setTimeout.callCount, 1, "setTimeout still in use");
    chai.assert.equal(global.setTimeout.callCount, 1, "setInterval still in use");

    waitFor(function(){
      chai.assert.ok(console.log.calledWith("bleep bloop!"), "result was not logged");
    }, 500)
    .then(function(){done()}, done);
  })
});
