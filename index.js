var Q = require('q');

var doTheStuff = function(ajax, url, callback){
  var finalMessage = '';
  return ajax(url).then(function(result){
    console.log(result.data);
    finalMessage += result.data;
    return Q.all(
      [result.url1, result.url2].map(function(url){
        return ajax(url);
      })
    );
  })
  .then(function(results){
    console.log(results[0].data);
    console.log(results[1].data);

    finalMessage += results[0].data + results[1].data;
    return finalMessage;
  })
  .then(null, function(error){
    console.log(error);
    throw error;
  }).nodeify(callback);
};

module.exports = doTheStuff;
