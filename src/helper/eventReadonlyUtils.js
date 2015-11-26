( function(){
  "use strict";

  var eventReadonly2_eventType2fnHandler_ = {
    $hovering: {
      mouseover: function () {
        this.$changeAttrVal( "$hovering", true );
      },
      mouseout: function () {
        this.$changeAttrVal( "$hovering", false );
      }
    },
    $clicking: {
      mousedown: function () {
        this.$changeAttrVal( "$clicking", true );
      },
      touchdown: function () {
        this.$changeAttrVal( "$clicking", true );
      },
      mouseup: function () {
        this.$changeAttrVal( "$clicking", false );
      },
      mouseleave: function () {
        this.$changeAttrVal( "$clicking", false );
      },
      touchup: function () {
        this.$changeAttrVal( "$clicking", false );
      }
    },
    $focused: {
      focus: function () {
        this.$requestRecalculation( "$focused" );
      },
      blur: function () {
       this.$requestRecalculation( "$focused" );
      }
    },
    $scrolledX: {
      scroll: function () {
        this.$requestRecalculation( "$scrolledX" );
      }
    },
    $scrolledY: {
      scroll: function () {
        this.$requestRecalculation( "$scrolledY" );

      }
    },
    $cursorX: {
      mousemove: function () {
        this.$requestRecalculation( "$cursorX" );

      }
    },
    $cursorY: {
      mousemove: function () {
        this.$requestRecalculation( "$cursorY" );

      }
    },

    $input: {
      click: function () {
        this.$requestRecalculation( "$input" );
      },
      change: function () {
        this.$requestRecalculation( "$input" );
      },
      keyup: function () {
        this.$requestRecalculation( "$input" );
      }
    },

    $inputChecked: {
      change: function () {
        this.$requestRecalculation( "$inputChecked" );
      }
    }

  };


  LAY.$eventReadonlyUtils = {
    checkIsEventReadonlyAttr: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ] !==
        undefined;
    },
    getEventType2fnHandler: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ];
    }

  };


})();
