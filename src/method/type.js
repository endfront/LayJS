(function () {
  "use strict";

  // source: jquery-2.1.1.js (line 302, 529)

  var typeIdentifier2_type_ = {
  '[object Boolean]':    'Boolean',
  '[object Number]':     'Number',
  '[object String]':     'String',
  '[object Function]':    'Function',
  '[object Array]':     'Array',
  '[object Date]':      'Date',
  '[object RegExp]':    'RegExp',
  '[object Object]':    'Object',
  '[object Error]':     'Error'
};


  LSON.type = function( obj ) {
    if ( obj === null ) {
      return obj + "";
    }
    // Support: Android < 4.0, iOS < 6 (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function" ?
    typeIdentifier2_type_[ toString.call(obj) ] || "object" :
    typeof obj;
  };

})();
