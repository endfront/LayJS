( function() {
  "use strict";

  var
    rootLazyProp2defaultVal = {
      userSelect: "auto",
      cursor: "auto",
      textSize: 15,
      textFamily: "sans-serif",
      textWeight: "normal",
      textColor: LAY.color("black"),
      textVariant: "normal",
      textTransform: "none",
      textStyle: "normal",
      textLetterSpacing: 0,
      textWordSpacing: 0,
      textAlign: "left",
      textDirection: "ltr",
      textLineHeight: 1.3,
      textIndent: 0,
      textWrap: "nowrap",
      textWordBreak: "normal",
      textWordWrap: "normal",
      textSmoothing: "antialiased",
      textRendering: "auto"
    },

    nonRootLazyProp2defaultVal = {
      userSelect: LAY.take("../", "userSelect"),
      cursor: LAY.take("../", "cursor"),
      textSize: LAY.take("../", "textSize"),
      textFamily: LAY.take("../", "textFamily"),
      textWeight: LAY.take("../", "textWeight"),
      textColor: LAY.take("../", "textColor"),
      textVariant: LAY.take("../", "textVariant"),
      textTransform: LAY.take("../", "textTransform"),
      textStyle: LAY.take("../", "textStyle"),
      textLetterSpacing: LAY.take("../", "textLetterSpacing"),
      textWordSpacing: LAY.take("../", "textWordSpacing"),
      textAlign: LAY.take("../", "textAlign"),
      textDirection: LAY.take("../", "textDirection"),
      textLineHeight: LAY.take("../", "textLineHeight"),
      textIndent: LAY.take("../", "textIndent"),
      textWrap: LAY.take("../", "textWrap"),
      textWordBreak: LAY.take("../", "textWordBreak"),
      textWordWrap: LAY.take("../", "textWordWrap"),
      textSmoothing: LAY.take("../", "textSmoothing"),
      textRendering: LAY.take("../", "textRendering")
    },

    commonLazyProp2defaultVal = {
      display: true,
      visible: true,
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
      originZ: 0,
      perspective:0,
      perspectiveOriginX: 0.5,
      perspectiveOriginY: 0.5,
      backfaceVisibility: false,
      opacity:1.0,
      zIndex: "auto",
      scrollX: 0,
      scrollY: 0,
      focus: false,
      scrollElastic: true,
      title: null,
      backgroundColor: LAY.transparent(),
      backgroundImage: "none",
      backgroundAttachment: "scroll",
      backgroundRepeat: "repeat",
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
      textOverflow: "clip",
      textDecoration: "none",

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

      image:null,
      imageAlt: null,

      link: null,

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
      audioVolume: 1.0

    };

  LAY.$getLazyPropVal = function ( prop, isRootLevel ) {

    var commonLazyVal = commonLazyProp2defaultVal[ prop ];
    return commonLazyVal !== undefined ?
      commonLazyVal :
      ( isRootLevel ?
        rootLazyProp2defaultVal[ prop ] :
        nonRootLazyProp2defaultVal[ prop ] );

  }

})();
