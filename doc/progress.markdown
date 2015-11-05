


Current:
  - /*this.transitionCalcVal =
          this.level.$part.node.scrollLeft;*/
    to be pushed into transition animation logic
  - test Textarea
  - test Image
  - test if "input" sets "$input" to "< value >" instead of ""
  - LAID.level.remove() for input node clearance
  - $numberOfChildren
  - $containerCenterX, $containerCenterY,
   $containerRight, $containerBottom
  - userSelect not working


  many:
  - sorting rows
  - ascending rows
  - lson.type ??

  spec:
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
  - rowsCommit
  - takes across forbidden objects such as "when", "transition", etc
  - natural width and height dependent upon the rotation of Z axis of children.
  - Insert CSS from entry.js (normalize.css CSS)
  - move `eventReadonlyEventType2boundFnHandler` outside of AttrVal (move to Level) to save space
  - Add/interface HTML history module support
  - change 'audio/videoControl"s"' to 'audio/videoControl' to respect naming convention of props?
  - Add $time as a read only property of root '/'
  - Canvas support
  - $numberOfChildren
  - $numberOfDisplayedChildren
  - Convert between transition and calc when transition add/delete
  - Introduce order number key for states
  - feature function which checks for overlapping parts
hardware acceleration flag
  - Add constraint which tells you the (x, y) co-ordinates of the mouse position (use observe list for level '/' to activate)
  - Add support for radio buttons and other HTML5 input types
  - CSS will-change behind-the-scenes optimization
  - optimization: check all the props possible within the level (by checking root and the states) and only set defaults for those which are going to be used (make sure you include important superdefaults such as originX, originY,etc which come into the calculation)
  - 'when' for formation, it should include function handler for insertion of new item into the formation alongwith deletion.
  - Opacity to 0.999999 research and implementation within LAID
  - LAID.Color mix
  - Expand out object-typed data values
