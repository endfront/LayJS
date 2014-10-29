( function () {
  "use strict";





  var type2htmlTag = {

    "default": "div",
    canvas: "canvas",
    image: "img",
    video: "video",
    svg: "svg"

  };

  var inputWhichIsAnHtmlTagS = [

  "textarea",
  "select"

  ];



  var Part = function ( path, lson ) {

    this.type = lson.type || '';

    this.node = type === 'interface' ? undefined : path === '/' ? document.body : document.createElement( type2tag[ this.type ] );


    this.initProp2val = lson.props;

    LSON.dirtyPartS.push( this );

  };






















  /*
    Change variable names
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
