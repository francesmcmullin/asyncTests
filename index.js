var Q = require('q');

var doTheStuff = function(ajax, url, callback){
  callback = callback || function(){};
  ajax(url, function(error, result1){
    console.log(error || result1.data);
    if(error){return callback(error)}

    var results = [];
    var finished = 0;
    var stopped = false;

    ajax(result1.url1, checkFinished.bind(null, 1));
    ajax(result1.url2, checkFinished.bind(null, 2));

    function checkFinished(num, error, result){
      console.log(error || result.data);

      if(error) {
        if(!stopped){
          stopped = true;
          callback(error);
        }
        return;
      }

      results[num] = result.data;

      finished++;
      if(finished == 2) {
        callback(null, result1.data + results[1] + results[2]);
      }
    };
  })
};

module.exports = Q.denodeify(doTheStuff);


