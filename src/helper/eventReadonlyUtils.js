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
      mousemove: function (e) {
        this.$changeAttrVal( "$cursorX", e.clientX );
      }
    },
    $cursorY: {
      mousemove: function (e) {
        this.$changeAttrVal( "$cursorY", e.clientY );

      }
    },

    $input: {
      click: function () {
        if ( this.part.inputType === "multiline" ||
            this.part.inputType === "line" ) {
          this.$requestRecalculation( "$input" );
        }
      },
      change: function () {
        this.$requestRecalculation( "$input" );
      },
      keyup: function () {
        if ( this.part.inputType === "multiline" ||
            this.part.inputType === "line" ) {
          this.$requestRecalculation( "$input" );
        }
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
