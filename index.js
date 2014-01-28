var Q = require('q');

var doTheStuff = function(ajax, url, callback){
  ajax(url, function(error, result){
    console.log(error || result.data);
    if(error){return}

    ajax(result.url1, function(error, result){
      console.log(error || result.data);
    })
  })
};

module.exports = doTheStuff;
