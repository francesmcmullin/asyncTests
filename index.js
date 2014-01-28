var Q = require('q');

var doTheStuff = function(ajax, url, callback){
  return ajax(url).then(function(result){
    console.log(result.data);
    return ajax(result.url1);
  })
  .then(function(result){
    console.log(result.data);
  })
  .then(null, function(error){
    console.log(error);
    throw error;
  });
};

module.exports = doTheStuff;
