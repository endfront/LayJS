
(function(){
  "use strict";
  /* Modified source of: Paul Irish's https://gist.github.com/paulirish/5438650
  And https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
  */
  if ( window.performance === undefined ) {
    window.performance = {};
  }

  if ( window.performance.now === undefined ) {

    if ( Date.now === undefined ) {
      Date.now = function now() {
        return new Date().getTime();
      };
    }
    var nowOffset = Date.now();

    if ( performance.timing !== undefined && performance.timing.navigationStart !== undefined ) {
      nowOffset = performance.timing.navigationStart;
    }

    window.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }

})();
