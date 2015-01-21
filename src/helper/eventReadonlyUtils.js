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
    $input: {
      click: function () {
        this.$changeAttrVal( "$input", this.value );
      },
      change: function () {
        this.$changeAttrVal( "$input", this.value );
      },
      keydown: function () {
        this.$changeAttrVal( "$input", this.value );
      }
    },

    $inputChecked: {
      change: function () {
        this.$changeAttrVal( "$inputChecked", this.checked );
      }
    }




  };

  var eventReadonly2defaultVal = {
    $hovered: false,
    $focused: false,
    $clicked: false,
    scrolledX: 0,
    scrolledY: 0,
    cursorX: 0,
    cursorY: 0,
    $input: "",
    $inputChecked: false,
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
