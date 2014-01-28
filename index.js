var Q = require('q');

var doTheStuff = function(ajax, url, callback){
  ajax(url, function(error, result){
    console.log(result.data);
  })
};

module.exports = doTheStuff;
