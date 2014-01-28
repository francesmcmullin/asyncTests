var Q = require('q');

var doTheStuff = function(ajax, url, callback){
  callback = callback || function(){};
  ajax(url, function(error, result1){
    console.log(error || result1.data);
    if(error){return callback(error)}

    ajax(result1.url1, function(error, result2){
      console.log(error || result2.data);
      if(error){return}

      callback(null, result1.data + result2.data);
    })
  })
};

module.exports = doTheStuff;
