var Q = require('q');

var doTheStuff = function(ajax, url, callback){
  return ajax(url).then(function(result){
    console.log(result.data);
  });
};

module.exports = doTheStuff;
