( function () {
  "use strict";

  var
    nonRootEssentialProp2defaultValue,
    rootEssentialProp2defaultValue,
    lazyProp2defaultValue;


  LAID.$defaultizePartLson = function ( lson, isRootLevel ) {
    var
      essentialProp,
      rootState = lson.states.root,
      rootStateProps = rootState.props,
      rootStateWhen = rootState.when,
      rootStateTransition = rootState.transition,
      props,
      states = lson.states,
      stateName, state,
      prop,
      when, transition, metaMax, maxProp,
      eventType, transitionProp,
      essentialProp2defaultValue = isRootLevel ?
        rootEssentialProp2defaultValue :
        nonRootEssentialProp2defaultValue ;

      /* Filling in the defaults here for root state lson */

    for ( essentialProp in essentialProp2defaultValue ) {
      if ( rootStateProps[ essentialProp ] === undefined ) {
        rootStateProps[ essentialProp ] =
          essentialProp2defaultValue[ essentialProp ];
      }
    }
  

    if ( states ) {
      for ( stateName in states ) {
        state = states[ stateName ];
        props = state.props;
        when = state.when;
        transition = state.transition;
        metaMax = state.$$max;

        /*if ( props.left || props.left === 0 ) {
          takeLeft = new LAID.Take( "",  stateName + ".left" );

          props.centerX = new LAID.Take( fnPosToCenter ).fn(
            takeLeft, takeWidth );
          props.right = new LAID.Take( fnPosToEdge ).fn(
            takeLeft, takeWidth );
        }

        if ( props.top || props.top === 0 ) {
          takeTop = new LAID.Take( "",  stateName + ".top" );

          props.centerY = new LAID.Take( fnPosToCenter ).fn(
            takeTop, takeHeight );
          props.bottom = new LAID.Take( fnPosToEdge ).fn(
            takeTop, takeHeight );  
       }*/




        for ( prop in props ) {

          if ( ( rootStateProps[ prop ] === undefined ) &&
              ( lazyProp2defaultValue[ prop ] !== undefined )
            ) {
              rootStateProps[ prop ] = lazyProp2defaultValue[ prop ];
          }
        }
      }

      for ( maxProp in metaMax ) {
        lson.$$max = lson.$$max || {};

        if ( !lson.$$max[ maxProp ] ) {
          lson.$$max[ metaMax ] = metaMax[ maxProp ];
        }
      }

      for ( eventType in when ) {
        if ( !rootStateWhen[ eventType ] ) {
          rootStateWhen[ eventType ] = [];
        }
      }

      for ( transitionProp in rootStateTransition ) {
        if ( !rootStateTransition[ transitionProp ] )  {
          rootStateTransition[ transitionProp ] = {};
        }
      }
    }

    if ( rootStateProps.text !== undefined &&
        ( lson.$type === undefined || lson.$type === "none" ) ) {
      lson.$type = "text";
    } else if ( lson.$type === undefined ) {
      lson.$type = "none";
    } else if ( lson.$type.startsWith( "input:" ) ) {
      lson.$inputType = lson.$type.slice( ( "input:" ).length );
      /*
      if ( rootStateProps.width ===
       essentialProp2defaultValue.width ) {
        rootStateProps.width = takeNaturalWidthInput;
      }
      if ( rootStateProps.height ===
       essentialProp2defaultValue.height ) {
        rootStateProps.height = takeNaturalHeightInput;
      }*/

    }

  };
/*
  takeActualBottomWithRotateZ = new LAID.Take(function( top, height, width,
     rotateZ, originX, originY ){

    var
      rotateZradians = ( Math.PI / 180) * rotateZ,
      leftSegmentLength = width * ( 1 - originX ),
      rightSegmentLength = width * ( originX );

    return top + ( ( 1 - originY ) * height ) +
    Math.abs( Math.cos( rotateZradians ) * ( height / 2 ) ) +
      Math.max(
        Math.sin( rotateZradians ) * leftSegmentLength,
        Math.sin( -rotateZradians ) * rightSegmentLength
      );

    }).fn( LAID.take("", "top"),
        LAID.take("", "height"),
        LAID.take("", "width"),
        LAID.take("", "rotateZ"),
        LAID.take("", "originX"),
        LAID.take("", "originY")
        );

*/


  rootEssentialProp2defaultValue = {
    top: 0,
    left: 0,
    width: LAID.take("", "$naturalWidth"),
    height: LAID.take("", "$naturalHeight"),
    textSize: 15,
    textFamily: "sans-serif",
    textWeight: "normal",
    textColor: LAID.color("black"),
    textVariant: "normal",
    textTransform: "none",
    textStyle: "normal",
    textDecoration: "none",
    textLetterSpacing: "normal",
    textWordSpacing: "normal",
    textAlign: "start",
    textDirection: "ltr",
    textLineHeight: "1em",
    textSmoothing: "antialiased",
    textRendering: "auto",
    userSelect: "none"
  };

  nonRootEssentialProp2defaultValue = {
    top: 0,
    left: 0,
    width: LAID.take("", "$naturalWidth"),
    height: LAID.take("", "$naturalHeight"),
    textSize: LAID.take("../", "textSize"),
    textFamily: LAID.take("../", "textFamily"),
    textWeight: LAID.take("../", "textWeight"),
    textColor: LAID.take("../", "textColor"),
    textVariant: LAID.take("../", "textVariant"),
    textTransform: LAID.take("../", "textTransform"),
    textStyle: LAID.take("../", "textStyle"),
    textLetterSpacing: LAID.take("../", "textLetterSpacing"),
    textWordSpacing: LAID.take("../", "textWordSpacing"),
    textDecoration: LAID.take("../", "textDecoration"),
    textAlign: LAID.take("../", "textAlign"),
    textDirection: LAID.take("../", "textDirection"),
    textLineHeight: LAID.take("../", "textLineHeight"),
    textSmoothing: LAID.take("../", "textSmoothing"),
    textRendering: LAID.take("../", "textRendering"),
    userSelect: LAID.take("../", "userSelect"),
  };


  /*
  takeLeft = new LAID.Take( "", "left" );
  takeTop = new LAID.Take( "", "top" );
  
  takeLeftToCenterX = new LAID.Take( fnPosToCenter ).fn( takeLeft, takeWidth );
  takeLeftToRight = new LAID.Take( fnPosToEdge ).fn( takeLeft, takeWidth );
  takeTopToCenterY = new LAID.Take( fnPosToCenter ).fn( takeTop, takeHeight );
  takeTopToBottom = new LAID.Take( fnPosToEdge ).fn( takeTop, takeHeight );
  */

  // These match the psuedo defaults for non expander props
  lazyProp2defaultValue = {
    display: true,
    z: 0,
    shiftX: 0,
    shiftY: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ:1,
    skewX: 0,
    skewY: 0,
    originX: 0.5,
    originY: 0.5,
    originZ: 0.5,
    perspective:0,
    perspectiveOriginX: 0.5,
    perspectiveOriginY: 0.5,
    backfaceVisibility: false,
    opacity:1.0,
    userSelect: "all",
    zIndex: "auto",
    overflowX: "hidden",
    overflowY: "hidden",
    scrollX: 0,
    scrollY: 0,
    scrollElastic: true,
    cursor: "auto",
    backgroundColor: LAID.transparent(),
    backgroundImage: "none",
    backgroundAttachment: "scroll",
    backgroundRepeat: true,
    backgroundPositionX: 0,
    backgroundPositionY: 0,
    backgroundSizeX: "auto",
    backgroundSizeY: "auto",

    cornerRadiusTopLeft: 0,
    cornerRadiusTopRight: 0,
    cornerRadiusBottomLeft: 0,
    cornerRadiusBottomRight: 0,

    borderTopStyle: "solid",
    borderBottomStyle: "solid",
    borderRightStyle: "solid",
    borderLeftStyle: "solid",

    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,


    borderTopColor: LAID.transparent(),
    borderBottomColor: LAID.transparent(),
    borderRightColor: LAID.transparent(),
    borderLeftColor: LAID.transparent(),

    text: "",
    /*textSize: LAID.take("../", "textSize"),
    textFamily: LAID.take("../", "textFamily"),
    textWeight: LAID.take("../", "textWeight"),
    textColor: LAID.take("../", "textColor"),
    textVariant: LAID.take("../", "textVariant"),
    textTransform: "none"
    textStyle: LAID.take("../", "textStyle"),
    textLetterSpacing: "normal",
    textWordSpacing: "normal",
    textDecoration: "none",
    textAlign: "start",
    textDirection: "ltr",
    textLineHeight: 1,
    */

    textOverflow: "clip",
    textIndent: 0,
    textWhitespace: "normal",
    textWordBreak: "normal",

    textPaddingTop: 0,
    textPaddingRight: 0,
    textPaddingBottom: 0,
    textPaddingLeft: 0,

    input: "",
    inputLabel: "",
    inputPlaceholder: "",
    inputAutocomplete: false,
    inputAutocorrect: true,
    inputDisabled: false,

    videoAutoplay: false,
    videoControls: true,
    videoCrossorigin: "anonymous",
    videoLoop: false,
    videoMuted: false,
    videoPreload: "auto",
    videoPoster: null,

    audioControls: true,
    audioLoop: false,
    audioMuted: false,
    audioPreload: "auto",
    audioVolume: 0.7

  };
})();
