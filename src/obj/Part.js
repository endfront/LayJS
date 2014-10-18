( function () {
  "use strict";

  var type2tag = {

    text: 'div',
    image: 'img',
    video: 'video',
    canvas: 'canvas',
    input: 'input',
    textarea: 'textarea'

  };



  var prop2default = {



  };

  var dirty_css_propertyS = [

  "width",
  "height",
  "left",
  "top",
  "backgroundColor"

  ];





  var Part = function ( path, lson ) {

    this.type = prop2val.type || 'text';

    this.node = type === 'interface' ? undefined : path === '/' ? document.body : document.createElement( type2tag[ this.type ] );

    //this.dirty_css_propertyS = LSON._clone.singleLevelArray( dirty_css_propertyS );

    this.init_prop2val = lson.props;

    LSON.dirtyPartS.push( this );

  };




  Part.prototype.takeMe = function ( takerPart, prop ) {

    var takerPartS = this.prop2takerPartS[ prop ];
    if ( takerPartS === undefined ) {

      this.prop2takerPartS[ prop ] = [ takerPart ];

    } else if ( takerPartS.indexOf( prop ) !== -1 ) {

      takerPartS.push( prop );

    }

  };


  Part.prototype.takeMeNot = function ( takerPart, prop ) {

    var takerPartS = this.prop2takerPartS[ prop ];
    if ( takerPartS !== undefined ) {

      var ind = takerPartS.indexOf( prop );
      if ( ind !== -1 ) {

        if ( takerPartS.length === 1 ) {

          delete this.prop2takerPartS[ prop ];

        } else {

          takerPartS.splice( ind, 1 );

        }
      }
    }

  };





  Part.prototype.initProperties = function ( prop2val ) {


    this.prop2val = {};
    this.initiated = false;

    for ( var prop in prop2default ) {

      if ( prop2default.hasOwnProperty( prop ) ) {

        this.prop2val[ prop ] = prop2val[ prop ] !== undefined ? prop2val[ prop ] : prop2default[ prop ];

      }

    }

    var prop2data = prop2val.data ? prop2val.data : {};

    for ( prop in prop2data ) {

      if ( prop2data.hasOwnProperty( prop ) ) {

        this.prop2data[ "data." + prop ] = prop2data[ prop ];

      }

    }


  };














  /*
  * Normally functions are to be named camelcase,
  * however for cleaning properties, we shall use the following convention:
  */



  Part.prototype._fnClean_left =  function() {

    this.node.style.left = this._prop2val.left + "px";

  };


  Part.prototype._fnClean_top =  function() {

    this.node.style.top = this._prop2val.top + "px";

  };


  Part.prototype._fnClean_backgroundColor =  function() {

    this.node.style.backgroundColor = this._prop2val.backgroundColor;

  };

  LSON.Part = Part;

})();
