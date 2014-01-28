var justWait = require('promise-to-test').justWait;
var chai = require('chai');
var doTheStuff = require('../index');
var sinon = require('sinon');

describe("promises!", function(){
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

  it("makes initial fetch, then url1 and url2 concurrently, returns a promise", function(){
    var result = doTheStuff(ajax, first);
    chai.assert.ok(result, "should return a promise");
    chai.assert.ok(result.then, "should return a promise with a then method");
    return result.then(function(res){
      chai.assert.include(res, resps[first], "result must include initial data");
      chai.assert.include(res, resps[second], "result must include url1 data");
      chai.assert.include(res, resps[third], "result must include url2 data");
    });
  });
})
