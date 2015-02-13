( function(){
  "use strict";

  var eventReadonly2_eventType2fnHandler_ = {
    $hovered: {
      mouseover: function () {
        this.$changeAttrVal( "$hovered", true );
      },
      mouseout:   function () {
        this.$changeAttrVal( "$hovered", false );
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
    $clicked: {
      mousedown: function () {
        this.$changeAttrVal( "$clicked", true );
      },
      touchdown: function () {
        this.$changeAttrVal( "$clicked", true );
      },
      mouseup: function () {
        this.$changeAttrVal( "$clicked", false );
      },
      mouseleave: function () {
        this.$changeAttrVal( "$clicked", false );
      },
      touchup: function () {
        this.$changeAttrVal( "$clicked", false );
      },
    },
    $scrolledX: {
      scroll: function () {
        this.$changeAttrVal( "$scrolledX", this.part.node.scrollTop );
      }
    },
    $cursorX: {
      mousemove: function () {
        this.$changeAttrVal( "$cursorX", this.part.node.offsetX );
      }
    },
    $cursorY: {
      mousemove: function () {
        this.$changeAttrVal( "$cursorY", this.part.node.offsetY );
      }
    },
    $input: {
      click: function () {
        this.$changeAttrVal( "$input", this.part.node.value );
      },
      change: function () {
        this.$changeAttrVal( "$input", this.part.node.value );
      },
      keydown: function () {
        this.$changeAttrVal( "$input", this.part.node.value );
      }
    },

    $inputChecked: {
      change: function () {
        this.$changeAttrVal( "$inputChecked", this.checked );
      }
    }
  };


  LAID.$eventReadonlyUtils = {
    checkIsEventReadonlyAttr: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ] !== undefined;
    },
    getEventType2fnHandler: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ];
    },

  };


})();
