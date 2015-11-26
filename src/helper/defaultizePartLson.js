( function () {
  "use strict";

  var
    nonRootEssentialProp2defaultValue,
    rootEssentialProp2defaultValue,
    lazyProp2defaultValue;


  LAY.$defaultizePartLson = function ( lson, isRootLevel ) {
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
          takeLeft = new LAY.Take( "",  stateName + ".left" );

          props.centerX = new LAY.Take( fnPosToCenter ).fn(
            takeLeft, takeWidth );
          props.right = new LAY.Take( fnPosToEdge ).fn(
            takeLeft, takeWidth );
        }

        if ( props.top || props.top === 0 ) {
          takeTop = new LAY.Take( "",  stateName + ".top" );

          props.centerY = new LAY.Take( fnPosToCenter ).fn(
            takeTop, takeHeight );
          props.bottom = new LAY.Take( fnPosToEdge ).fn(
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
    }

  };
/*
  takeActualBottomWithRotateZ = new LAY.Take(function( top, height, width,
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

    }).fn( LAY.take("", "top"),
        LAY.take("", "height"),
        LAY.take("", "width"),
        LAY.take("", "rotateZ"),
        LAY.take("", "originX"),
        LAY.take("", "originY")
        );

*/


  rootEssentialProp2defaultValue = {
    top: 0,
    left: 0,
    width: LAY.take("", "$windowWidth"),
    height: LAY.take("", "$windowHeight"),
    textSize: 15,
    textFamily: "sans-serif",
    textWeight: "normal",
    textColor: LAY.color("black"),
    textVariant: "normal",
    textTransform: "none",
    textStyle: "normal",
    textDecoration: "none",
    textLetterSpacing: "normal",
    textWordSpacing: "normal",
    textAlign: "left",
    textDirection: "ltr",
    textLineHeight: "1em",
    textSmoothing: "antialiased",
    textRendering: "auto",
    userSelect: "none"
  };

  nonRootEssentialProp2defaultValue = {
    top: 0,
    left: 0,
    width: LAY.take("", "$naturalWidth"),
    height: LAY.take("", "$naturalHeight"),
    textSize: LAY.take("../", "textSize"),
    textFamily: LAY.take("../", "textFamily"),
    textWeight: LAY.take("../", "textWeight"),
    textColor: LAY.take("../", "textColor"),
    textVariant: LAY.take("../", "textVariant"),
    textTransform: LAY.take("../", "textTransform"),
    textStyle: LAY.take("../", "textStyle"),
    textLetterSpacing: LAY.take("../", "textLetterSpacing"),
    textWordSpacing: LAY.take("../", "textWordSpacing"),
    textDecoration: LAY.take("../", "textDecoration"),
    textAlign: LAY.take("../", "textAlign"),
    textDirection: LAY.take("../", "textDirection"),
    textLineHeight: LAY.take("../", "textLineHeight"),
    textSmoothing: LAY.take("../", "textSmoothing"),
    textRendering: LAY.take("../", "textRendering"),
    userSelect: LAY.take("../", "userSelect")
  };


  /*
  takeLeft = new LAY.Take( "", "left" );
  takeTop = new LAY.Take( "", "top" );
  
  takeLeftToCenterX = new LAY.Take( fnPosToCenter ).fn( takeLeft, takeWidth );
  takeLeftToRight = new LAY.Take( fnPosToEdge ).fn( takeLeft, takeWidth );
  takeTopToCenterY = new LAY.Take( fnPosToCenter ).fn( takeTop, takeHeight );
  takeTopToBottom = new LAY.Take( fnPosToEdge ).fn( takeTop, takeHeight );
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
    focus: false,
    scrollElastic: true,
    cursor: "auto",
    backgroundColor: LAY.transparent(),
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


    borderTopColor: LAY.transparent(),
    borderBottomColor: LAY.transparent(),
    borderRightColor: LAY.transparent(),
    borderLeftColor: LAY.transparent(),

    text: "",
    /*textSize: LAY.take("../", "textSize"),
    textFamily: LAY.take("../", "textFamily"),
    textWeight: LAY.take("../", "textWeight"),
    textColor: LAY.take("../", "textColor"),
    textVariant: LAY.take("../", "textVariant"),
    textTransform: "none"
    textStyle: LAY.take("../", "textStyle"),
    textLetterSpacing: "normal",
    textWordSpacing: "normal",
    textDecoration: "none",
    textAlign: "start",
    textDirection: "ltr",
    textLineHeight: 1,
    */

    textOverflow: "clip",
    textIndent: 0,
    textWrap: "nowrap",
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
