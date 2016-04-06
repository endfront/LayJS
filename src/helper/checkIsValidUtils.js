(function(){
  "use strict";


  var reservedNameS = [
    "root", "transition", "data", "when", "onlyif",
    "states", "exist", "css",
    "",
    "many", "formation", "formationDisplayNone",
     "sort", "fargs",
    "rows", "row", "filter", "args",
    "view", "page", "extfonts", "type", "obdurate"
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

  /*
  * Must not contain ".", "/", "~", ":", "@","#", "^"
  */
  function checkIfNoIllegalCharacters ( name ) {
    return !(/\.|\/|\~|\:|\@|\#|\^/.test(name));
  }

  LAY.$checkIsValidUtils = {
  	levelName: function ( levelName ) {
  		return checkIfNoIllegalCharacters( levelName ) &&
        ( reservedNameS.indexOf( levelName ) === -1 );
  	},
  	/*
  	* Rules of a state name:
  	* (1) Must not contain any illegal characters
l  	* (2) Must not be a reserved name with the exception of "root"
    * as "root" state name has already been checked at the
    * start of normalizing
  	*/
  	stateName: function ( stateName ) {
  		 return checkIfNoIllegalCharacters( stateName ) &&
        ( ( reservedNameS.indexOf( stateName ) === -1 ) ||
           ( stateName === "root" ) );

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
         "videos", "audios", "videoTracks", "audioTracks",
          "filters","borderTop", "borderRight", "borderBottom", "borderLeft",
      ];
       var regexExpanderProps = /(^boxShadows\d+$)|(^textShadows\d+$)|(^videos\d+$)|(^audios\d+$)|(^videoTracks\d+$)|(^audioTracks\d+$)|(^filters\d+$)|(^filters\d+DropShadow$)/;

      var strippedStateAttr = stripStateAttrPrefix( attr );
      return ( ( expanderPropS.indexOf( strippedStateAttr ) !== -1 ) ||
        ( regexExpanderProps.test( strippedStateAttr ) )
      );
    },

  	propAttr: function ( attr ) {
  		return ( ( attr.indexOf( "." ) === -1 ) &&
     		( attr.charAt(0) !== "$") &&
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
