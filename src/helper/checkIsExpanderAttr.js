(function() {
  "use strict";


  var expanderAttrS = [
  "border", "background", "boxShadows", "textShadows", "videoSources", "audioSources", "videoTracks", "audioTracks", "filters",
   "borderTop", "borderRight", "borderBottom", "borderLeft",
    "data", "when", "transition", "state", "type", "inherit", "states", "observe"
     ];
  var regexExpanderAttrs = /(^boxShadows\d+$)|(^textShadows\d+$)|(^videoSources\d+$)|(^audioSources\d+$)|(^videoTracks\d+$)|(^audioTracks\d+$)|(^filters\d+$)|(^filters\d+DropShadow$)|(^transition\.[a-zA-Z]+$)|(^transition\.[a-zA-Z]+\.args$)|(^when\.[a-zA-Z]+$)/;
  var nonStateAttrPrefixS = [ "data", "when", "transition", "state" ];

  function stripStateAttrPrefix( attr ) {
    var i = attr.indexOf(".");
    if ( i === -1 ) {
      return attr;
    } else {
      var prefix = attr.slice( 0, i );
      if ( nonStateAttrPrefixS.indexOf( prefix ) ) {
        return attr;
      } else {
        return attr.slice( i + 1 );
      }
    }
  }

  LAID.$checkIsExpanderAttr = function ( attr ) {
    var strippedStateAttr = stripStateAttrPrefix( attr );
    return ( ( expanderAttrS.indexOf( strippedStateAttr ) !== -1 ) ||
    ( regexExpanderAttrs.test( strippedStateAttr ) )
  );
  };

})();
