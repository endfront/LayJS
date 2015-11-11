(function(){	
  "use strict";


  var reservedNameS = [ 
    "root", "transition", "data", "when", "load",
    "",
    "many", "formation", "formationDisplayNone",
     "sort", "fargs",
    "rows", "row", "filter", "args", "all"
  ];

  function stripStateAttrPrefix( attr ) {
    var nonStateAttrPrefixS = [ "data", "when", "transition" ];
    var i = attr.indexOf(".");
    if ( i === -1 ) {
      return attr;
    } else {
      var prefix = attr.slice( 0, i );
      if ( nonStateAttrPrefixS.indexOf( prefix ) !== -1 ) {
        return attr;
      } else {
        return attr.slice( i + 1 );
      }
    }
  }

  LAID.$checkIsValidUtils = {
  	levelName: function ( levelName ) {
  		return ( /^[\w\-]+$/ ).test( levelName ) &&
        ( reservedNameS.indexOf( levelName ) === -1 );
  	},
  	/*
  	* Rules of a state name:
  	* (1) Must only contain alphanumeric characters, the underscore ("_"), or the hyphen ("-")
  	* (2) Must contain atleast one character
  	* (3) Must not be a reserved name with the exception of "root"
  	*/
  	stateName: function ( stateName ) {
  		 return (
       ( ( ( /^[\w\-]+$/ ).test( stateName ) ) &&
		    ( 
          ( reservedNameS.indexOf( stateName ) === -1 ) ||
          stateName === "root"
        )
      )
       || 
       ( stateName === "formation") || 
       ( stateName === "formationDisplayNone")
       );
  	},

    checkIsAttrExpandable: function ( attr ) {
      return this.checkIsNonPropAttrExpandable( attr ) ||
        this.checkIsPropAttrExpandable( attr );
    },

  	checkIsNonPropAttrExpandable: function ( attr ) {
  		var expanderAttrS = [
			    "data", "when", "transition", "states", "fargs", "sort"
			];
			 var regexExpanderAttrs = /(^sort\.\d+$)|(^fargs\.[a-zA-Z]+$)|(^transition\.[a-zA-Z]+$)|(^transition\.[a-zA-Z]+\.args$)|(^when\.[a-zA-Z]+$)/;

  		var strippedStateAttr = stripStateAttrPrefix( attr );
    	return ( ( expanderAttrS.indexOf( strippedStateAttr ) !== -1 ) ||
      	( regexExpanderAttrs.test( strippedStateAttr ) )
    	);
  	},

    checkIsPropAttrExpandable: function ( attr ) {
      var expanderPropS = [
        "border", "background", "boxShadows", "textShadows",
         "videoSources", "audioSources", "videoTracks", "audioTracks",
          "filters","borderTop", "borderRight", "borderBottom", "borderLeft",
      ];
       var regexExpanderProps = /(^boxShadows\d+$)|(^textShadows\d+$)|(^videoSources\d+$)|(^audioSources\d+$)|(^videoTracks\d+$)|(^audioTracks\d+$)|(^filters\d+$)|(^filters\d+DropShadow$)/;

      var strippedStateAttr = stripStateAttrPrefix( attr );
      return ( ( expanderPropS.indexOf( strippedStateAttr ) !== -1 ) ||
        ( regexExpanderProps.test( strippedStateAttr ) )
      );
    },

  	propAttr: function ( attr ) {
  		return ( ( attr.indexOf( "." ) === -1 ) &&
     		( attr[ 0 ] !== "$") &&
        ( reservedNameS.indexOf( attr ) === -1 )
       );
  	},

  	// source: underscore.js
  	nan: function ( num ) {
  		return ( typeof val === "number" ) &&
	     ( val !== +val );
  	}

  };

})();