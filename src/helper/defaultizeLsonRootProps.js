( function () {
  "use strict";

  var
    essentialProp2defaultValue,
    lazyProp2defaultValue;

  LAID.$defaultizeLsonRootProps = function ( lson ) {
    var
      essentialProp,
      props = lson.props,
      states = lson.states,
      stateName, state,
      prop,
      when, transition, metaMax, maxProp,
      eventType, transitionProp;

    /* Filling in the defaults here for root lson */
    for ( essentialProp in essentialProp2defaultValue ) {
      if ( props[ essentialProp ] === undefined ) {
        props[ essentialProp ] = essentialProp2defaultValue[ essentialProp ];
      }
    }


    if ( states ) {
      for ( stateName in states ) {
        state = states[ stateName ];
        props = state.props;
        when = state.when;
        transition = state.transition;
        metaMax = state.$$max;

        for ( prop in props ) {

          if ( ( lson.props[ prop ] === undefined ) &&
              ( lazyProp2defaultValue[ prop ] !== undefined )
            ) {

              lson.props[ prop ] = lazyProp2defaultValue[ prop ];
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
        if ( !lson.when[ eventType ] ) {
          lson.when[ eventType ] = [];
        }
      }

      for ( transitionProp in transition ) {
        if ( !lson.transition[ transitionProp ] )  {
          lson.transition[ transitionProp ] = {};
        }
      }
    }

    if ( lson.props.text !== undefined ) {
      lson.type = "text";
    } else if ( lson.type === undefined ) {
      lson.type = "none";
    } else if ( lson.type.startsWith( "input:" ) ) {
      lson.inputType = lson.type.slice( ( "input:").length );
    }


  };

  essentialProp2defaultValue = {
    width:  new LAID.Take( "this", "$naturalWidth" ),
    height:  new LAID.Take( "this", "$naturalHeight" ),
    top: 0,
    left: 0
  };

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
    zIndex: "auto",
    overflowX: "hidden",
    overflowY: "hidden",
    scrollX: 0,
    scrollY: 0,
    scrollElastic: true,
    cursor: "auto",
    backgroundColor: LAID.transparent(),
    backgroundImage: "none",
    backgroundAttachmented: "scroll",
    backgroundRepeat: true,
    backgroundPositionX: 0,
    backgroundPositionY: 0,
    backgroundSizeX: undefined,
    backgroundSizeY: undefined,


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
    textSize: 16,
    textFamily: "sans-serif",
    textWeight: "normal",
    textcolor: LAID.color("black"),
    textVariant: "normal",
    textStyle: "normal",
    textDecoration: "none",
    textAlign: "start",
    textLetterSpacing: undefined,
    textWordSpacing: undefined,
    textOverflow: "clip",
    textIndent: 0,
    textWhitespace: "normal",

    textPaddingTop: 0,
    textPaddingRight: 0,
    textPaddingBottom: 0,
    textPaddingLeft: 0,

    input: "",
    inputLabel: "",
    inputRows: 2,
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
