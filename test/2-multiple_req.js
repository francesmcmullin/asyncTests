var waitFor = require('promise-to-test').waitFor;
var justWait = require('promise-to-test').justWait;
var chai = require('chai');
var doTheStuff = require('../index');
var sinon = require('sinon');
var Q = require('q');

describe("tricky async", function(){
  beforeEach(function() {
    if(!console.log.restore) sinon.spy(console, "log")
  });

  afterEach(function(){
    if(console.log.restore) console.log.restore();
  });

  var first="first", second="second", third="third";
  var resps = {first:"bleep!", second:"bloop!", third:"blop!"};
  var errs  = {};

  var ajax = function(url, callback){
    return justWait(100).then(function(){
      var err = errs[url];
      delete errs[url];
      if(err) throw err;
      return {data: resps[url], url1:second, url2:third};
    }).nodeify(callback);
  }

  it("makes a second fetch", function() {
    doTheStuff(ajax, first);

    return waitFor(function(){
      chai.assert.ok(console.log.calledWith("bleep!"), "first result was not logged");
      chai.assert.ok(console.log.calledWith("bloop!"), "second result was not logged");
    }, 500);
  });

  it("logs an error in the second fetch", function(){
    errs.second = "woops!";

    doTheStuff(ajax, first);

    return waitFor(function(){
      chai.assert.ok(console.log.calledWith("bleep!"), "first result was not logged");
      chai.assert.ok(console.log.calledWith("woops!"), "error was not logged");
    }, 500);
  });

  it("logs an error in the first fetch", function(){
    errs.first = "argh!";

    doTheStuff(ajax, first);

    return waitFor(function(){
      chai.assert.ok(console.log.calledWith("argh!"), "error was not logged");
    }, 500);
  });

  it("halts operations after an error in the first fetch", function(){
    errs.first = "yikes!";
    var spiedAjax = sinon.spy(ajax);
    doTheStuff(spiedAjax, first);

    return waitFor(function(){
      chai.assert.ok(console.log.calledWith("yikes!"), "error was not logged");
      chai.assert.equal(spiedAjax.callCount, 1, "called ajax twice, should halt after error");
    }, 500);
  });

  it("invokes a callback with the results concatenated", function(){
    var finished = false;

    var resultProm = Q.denodeify(doTheStuff)(ajax, first).then(function(result){
      finished = true;
      chai.assert.include(result, resps[first], "result should include data from first ajax fetch");
      chai.assert.include(result, resps[second], "result should include data from second ajax fetch");
   }, function(err){
      finished = true;
      chai.assert.ok(false, "the callback should not be called with an error param (1st argument)");
    });

    return waitFor(function(){
      chai.assert.ok(finished, "timed out waiting for callback function to be invoked with the results");
    })
    .then(function(){return resultProm;});
  });

  it("invokes a callback with a first fetch error", function(){
    errs.first = "oh dear!";
    var finished = false;

    var resultProm = Q.denodeify(doTheStuff)(ajax, first).then(function(result){
      finished = true;
      chai.assert.ok(false, "should not give result when there was an ajax error");
    }, function(err){
      finished = true;
      chai.assert.include(err, "oh dear!", "error must include error");
      return "fixed";
    });

    return waitFor(function(){
      chai.assert.ok(finished, "timed out waiting for callback function to be invoked with the error");
    }, 900)
    .then(function(){return resultProm;});
  });
  it("invokes a callback with a second fetch error", function(){
    errs.second = "ruh roh!";
    var finished = false;

    var resultProm = Q.denodeify(doTheStuff)(ajax, first).then(function(result){
      finished = true;
      chai.assert.ok(false, "should not give result when there was an ajax error");
    }, function(err){
      finished = true;
      chai.assert.include(err, "ruh roh!", "error must include error");
      return "fixed";
    });

    return waitFor(function(){
      chai.assert.ok(finished, "timed out waiting for callback function to be invoked with the error");
    }, 900)
    .then(function(){return resultProm;});
  });
});
