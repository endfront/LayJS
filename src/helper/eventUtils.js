( function () {
  "use strict";


  // Modified Source of: Dean Edwards, 2005
  // with input from Tino Zijdel, Matthias Miller, Diego Perini
  // Original Source: http://dean.edwards.name/weblog/2005/10/add-event/

  LAY.$eventUtils = {
    add: function ( element, type, handler ) {
      if ( element.addEventListener ) {
        element.addEventListener(type, handler, false);
      } else {
        // create a hash table of event types for the element
        if (!element.events) element.events = {};
        // create a hash table of event handlers for each element/event pair
        var handlers = element.events[type];
        if (!handlers) {
          handlers = element.events[type] = [];
          // store the existing event handler (if there is one)
          if (element["on" + type]) {
            handlers.push( element["on" + type] );
          }
        }
        // add the event handler to the list of handlers
        handlers.push( handler );
        // assign a global event handler to do all the work
        element["on" + type] = handle;
      }
    },

    remove: function ( element, type, handler ) {
      if ( element.removeEventListener ) {
        element.removeEventListener(type, handler, false);
      } else {
        // delete the event handler from the hash table
        if (element.events && element.events[type]) {
          var handlers = element.events[type];
          LAY.$arrayUtils.remove(handlers, handler);
        }
      }
    }
  };

  function handle( event ) {
    var returnValue = true;
    // grab the event object (IE uses a global event object)
    event = event || fix(((this.ownerDocument || this.document || this).parentWindow || window).event);
    // get a reference to the hash table of event handlers
    var handlers = this.events[event.type];
    // execute each event handler
    for ( var i=0, len=handlers.length; i<len; i++ ) {
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
