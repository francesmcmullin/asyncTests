var Q = require('q');

var doTheStuff = function(ajax, url, callback){
  var finalMessage = '';
  return ajax(url).then(function(result){
    console.log(result.data);
    finalMessage += result.data;
    return ajax(result.url1);
  })
  .then(function(result){
    console.log(result.data);
    finalMessage += result.data;
    return finalMessage;
  })
  .then(null, function(error){
    console.log(error);
    throw error;
  }).nodeify(callback);
};

module.exports = doTheStuff;
