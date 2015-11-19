
Current:
  - < state >.bottom/right/centerX/centerY
  - when event array normalization
  - centerX undefined in Level.attr2attrVal
  - lazyProp2defaultValue has originX and perspectiveOriginX as 0.5?
  - backface-visibility hidden perf
  - ONLY 1 NODE to count the goddamn text dimesions is the DREAM COME TRUE
  - grid formation
  - */ to reach row
  - height/width change should trigger scrollY/X change if
    applicable, similarly double-check is naturalHeight/Width
    changes does the trigger without using setTimeout
  - input:file,select
  - Canvas support
  - checkIsValidUtils.isExpanderAttr() <- make similar to prevent takes of "$type", "$inherit", "$observe"
  - checkAndThrowErrorAttrAsTake
  - LAID.Many.remove()
  - test Textarea
  - test Image
  - test Video
  - $containerCenterX, $containerCenterY,
    $containerRight, $containerBottom rename
  - test if "input" sets "$input" to "< value >" instead of ""
  - website


  spec:
  - .../
  - many.rows can take array of non-objects
  - Add "$i" index for Many to spec
  - formation spec (include part for creating formations)
  - add LAID.level.changeNativeInput/ScrollX/Y() to spec
  - $centerX, $centerY, $right, $bottom
  - update spec to have quotes around state names
  - filter.end()

  todomvc:
  - delete item
  - check all to complete
  - routing


Future:
  - $input switch-off optimization (think email/long-text entry)
  - $browser attr
  - CSS pointer-events optimization
  - $naturalWidth/$naturalHeight shouldn't transition from 0 to < diemsion > on load
  - takes across forbidden objects such as "when", "transition", etc
  - natural width and height dependent upon the rotation of Z axis of children.
  - Insert CSS from entry.js (normalize.css CSS)
  - move `eventReadonlyEventType2boundFnHandler` outside of AttrVal (move to Level) to save space
  - Add/interface HTML history module support
  - change 'audio/videoControl"s"' to 'audio/videoControl' to respect naming convention of props?
  - Add $time as a read only property of root '/'
  - $numberOfChildren
  - $numberOfDisplayedChildren
  - Convert between transition and calc when transition add/delete
  - Introduce order number key for states
  - feature function which checks for overlapping parts
hardware acceleration flag
  - Add constraint which tells you the (x, y) co-ordinates of the mouse position (use observe list for level '/' to activate)
  - Add support for other HTML5 input types
  - CSS will-change behind-the-scenes optimization
  - optimization: check all the props possible within the level (by checking root and the states) and only set defaults for those which are going to be used (make sure you include important superdefaults such as originX, originY,etc which come into the calculation)
  - 'when' for formation, it should include function handler for insertion of new item into the formation alongwith deletion.
  - Opacity to 0.999999 research and implementation within LAID
  - LAID.Color mix
  - Expand out object-typed data values
