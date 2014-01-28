var Q = require('q');

var doTheStuff = function(ajax, url, callback){
  var result = ajax(url)
  function checkForResult(){
    if(result.data) {
      console.log(result.data);
    } else {
      setTimeout(checkForResult, 10);
    }
  }
  checkForResult();
};

module.exports = doTheStuff;
