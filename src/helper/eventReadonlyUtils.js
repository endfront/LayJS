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
    $inputChecked: {
      change: function () {
        this.$changeAttrVal( "$inputChecked", this.checked );
      }
    },
    $inputText: {
      click: function () {
        this.$changeAttrVal( "$inputText", this.value );
      },
      keydown: function () {
        this.$changeAttrVal( "$inputText", this.value );
      }
    },

    $clicked: {
      mousedown: function () {
        this.$changeAttrVal( "$clicked", true );
      },
      mouseup: function () {
        this.$changeAttrVal( "$clicked", false );
      }
    },
    $scrolledX: {
      scroll: function () {
        this.$changeAttrVal( "$scrolledX", this.scrollTop );
      }
    },
    $cursorX: {
      mousemove: function () {
        this.$changeAttrVal( "$cursorX", this.offsetX );
      }
    },
    $cursorY: {
      mousemove: function () {
        this.$changeAttrVal( "$cursorY", this.offsetY );
      }
    },


  };

  var eventReadonly2defaultVal = {
    $hovered:false,
    $focused: false

  };

  LAID.$eventReadonlyUtils = {
    checkIsEventReadonlyAttr: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ] !== undefined;
    },
    getEventType2fnHandler: function ( attr ) {
      return eventReadonly2_eventType2fnHandler_[ attr ];
    },

    getEventReadonly2defaultVal: function () {
      return eventReadonly2defaultVal;
    }

  };


})();
