( function () {
  "use strict";

  var GUID = 1;

  LAY.$eventUtils = {
    add: function (element, type, handler) {
      if (element.addEventListener) {
        element.addEventListener(type, handler, false);
      } else {
        // assign each event handler a unique ID
        if (!handler.$$guid) handler.$$guid = GUID++;
        // create a hash table of event types for the element
        if (!element.events) element.events = {};
        // create a hash table of event handlers for each element/event pair
        var handlers = element.events[type];
        if (!handlers) {
          handlers = element.events[type] = {};
          // store the existing event handler (if there is one)
          if (element["on" + type]) {
            handlers[0] = element["on" + type];
          }
        }
        // store the event handler in the hash table
        handlers[handler.$$guid] = handler;
        // assign a global event handler to do all the work
        element["on" + type] = handle;
      }
    },

    remove: function (element, type, handler) {
      if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
      } else {
        // delete the event handler from the hash table
        if (element.events && element.events[type]) {
          delete element.events[type][handler.$$guid];
        }
      }
    }
  };

  function handle(event) {
    var returnValue = true;
    // grab the event object (IE uses a global event object)
    event = event || fix(((this.ownerDocument || this.document || this).parentWindow || window).event);
    // get a reference to the hash table of event handlers
    var handlers = this.events[event.type];
    // execute each event handler
    for (var i in handlers) {
      this.$$handleEvent = handlers[i];
      if (this.$$handleEvent(event) === false) {
        returnValue = false;
      }
    }
    return returnValue;
  }

  function fix(event) {
    // add W3C standard event methods
    event.preventDefault = fix_preventDefault;
    event.stopPropagation = fix_stopPropagation;
    return event;
  }
  function fix_preventDefault() {
    this.returnValue = false;
  }
  function fix_stopPropagation() {
    this.cancelBubble = true;
  }
})();


