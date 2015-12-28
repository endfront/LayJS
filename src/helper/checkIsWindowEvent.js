(function(){
  "use strict";
	LAY.$checkIsWindowEvent = function ( eventName ) {
		return [
			"beforeunload",
			"blur",
		  "error",
      "focus",
      "focusin",
      "focusout",
      "hashchange",
      "load",
      "message",
      "offline",
      "online",
      "orientationchange",
      "pagehide",
      "pageshow",
      "popstate",
      "resize",
      "scroll",
      "storage",
      "unload",
      "webkitmouseforcechanged",
      "webkitmouseforcedown",
      "webkitmouseforceup",
      "webkitmouseforcewillbegin",
      "webkitwillrevealbottom",
      "webkitwillrevealleft",
      "webkitwillrevealright",
      "webkitwillrevealtop",
		].indexOf( eventName ) !== -1;
	};

})();

