var justWait = require('promise-to-test').justWait;
var waitFor = require('promise-to-test').waitFor;
var Q = require('q');
var chai = require('chai');
var doTheStuff = require('../index');
var sinon = require('sinon');

describe("in parallel!", function(){
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
  it("fetches both url1 and url2", function(){
    var finished = false;
    var resultProm = Q.denodeify(doTheStuff)(ajax, first).then(function(result){
      finished = true;
      chai.assert.include(result, resps[first], "result must include initial data");
      chai.assert.include(result, resps[second], "result must include url1 data");
      chai.assert.include(result, resps[third], "result must include url2 data");
    });
    return waitFor(function(){
      chai.assert.ok(finished, "timed out waiting for callback function to be invoked with the results");
    }, 900)
    .then(function(){return resultProm;});
  });
  it("handles error from url1", function(){
    var finished = false;
    errs[second] = "broken!";
    var resultProm = Q.denodeify(doTheStuff)(ajax, first).then(function(result){
      finished = true;
      chai.assert.ok(false, "should not give result when there was an ajax error");
    }, function(err){
      finished = true;
      chai.assert.include(err, "broken!", "error must include error");
      return "fixed";
    });
    return waitFor(function(){
      chai.assert.ok(finished, "timed out waiting for callback function to be invoked with the error");
    }, 900)
    .then(function(){return resultProm;});
  });
  it("handles error from url2", function(){
    var finished = false;
    errs[third] = "not good!";
    var resultProm = Q.denodeify(doTheStuff)(ajax, first).then(function(result){
      finished = true;
      chai.assert.ok(false, "should not give result when there was an ajax error");
    }, function(err){
      finished = true;
      chai.assert.include(err, "not good!", "error must include error");
      return "fixed";
    });
    waitFor(function(){
      chai.assert.ok(finished, "timed out waiting for callback function to be invoked with the error");
    }, 900)
    .then(function(){return resultProm;})
  });
  it("only calls the callback once", function(){
    var callback = sinon.spy();
    errs[second] = "watch out!";
    errs[third] = "oh NOES!";
    doTheStuff(ajax, first, callback);
    justWait(900)
    .then(function(){
      chai.assert.equal(callback.callCount, 1, "callback should only be called once!");
    })
  });
})
