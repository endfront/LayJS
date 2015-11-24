( function(){
  "use strict";

  var $inputEvent2fn = {
    click: function () {
      this.$changeAttrVal( "$input", this.part.node.value );
    },
    change: function () {
      this.$changeAttrVal( "$input", this.part.node.value );
    },
    keyup: function () {
      this.$changeAttrVal( "$input", this.part.node.value );
    }
  };

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
        this.$changeAttrVal( "$focused", true );
      },
      blur: function () {
        this.$changeAttrVal( "$focused", false );
      }
    },
    $scrolledX: {
      scroll: function () {
        this.$changeAttrVal( "$scrolledX",
          this.part.node.scrollTop );
      }
    },
    $scrolledY: {
      scroll: function () {
        this.$changeAttrVal( "$scrolledY",
         this.part.node.scrollLeft );
      }
    },
    $cursorX: {
      mousemove: function () {
        this.$changeAttrVal( "$cursorX",
          this.part.node.offsetX );
      }
    },
    $cursorY: {
      mousemove: function () {
        this.$changeAttrVal( "$cursorY",
          this.part.node.offsetY );
      }
    },

    $input: $inputEvent2fn,
    /*$naturalWidth: $inputEvent2fn,
    $naturalHeight: $inputEvent2fn,*/

    $inputChecked: {
      change: function () {
        this.$changeAttrVal( "$inputChecked", this.checked );
      }
    }

  };


  LAID.$eventReadonlyUtils = {
    checkIsEventReadonlyAttr: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ] !==
        undefined;
    },
    getEventType2fnHandler: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ];
    }

  };


})();
