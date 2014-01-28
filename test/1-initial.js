var justWait = require('promise-to-test').justWait;
var waitFor = require('promise-to-test').waitFor;
var chai = require('chai');
var doTheStuff = require('../index');
var sinon = require('sinon');
var Q = require('q');

describe.skip("Initial Async", function(){
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
      return Q({data:"yay!"}).nodeify(callback);
    }

    doTheStuff(ajax)
    return waitFor(function(){
      chai.assert.ok(called, "ajax not called")
    }, 300);
  })

  it("calls the ajax and then logs the result", function(){
    doTheStuff(ajax);

    return waitFor(function(){
      chai.assert.ok(console.log.calledWith("bleep bloop!"), "result was not logged");
    }, 500);
  })

  it("uses the callback instead of looping", function(){
    sinon.spy(global, "setTimeout");
    sinon.spy(global, "setInterval");

    doTheStuff(ajax);
    chai.assert.ok(global.setTimeout.callCount < 2, "setTimeout still in use");
    chai.assert.ok(global.setTimeout.callCount < 2, "setInterval still in use");

    return waitFor(function(){
      chai.assert.ok(console.log.calledWith("bleep bloop!"), "result was not logged");
    }, 500);
  })
});
