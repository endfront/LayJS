
Current:
  - updateNaturalWidth should be a part of attrVal
  - todoMVC Learn section
  - throw error on no id provided
  - many.rows inheritance
  - `filterType = attr2attrVal[ "filters" + i + "Type" ].calcVal;`

  - TODOMVC: There is still a problem with height changes on filter
  - < state >.bottom/right/centerX/centerY
  - filter.end()
  - todoMVC routing
  - LAID.color() warning
    so that it doesn't get recalculated a million times
  - "url" hashchange "$url" ??
  - add all remaining filter/fold takes
  - function to get all partLevelS from many?
  - do you need to clone rows and filter in Take.js? and also in LAID.Many.prototype.queryRows/Filter?
  - lazyProp2defaultValue has originX and perspectiveOriginX as 0.5?
  - ONLY 1 NODE to count the goddamn text dimesions is the DREAM COME TRUE
  - grid formation
  - height/width change should trigger scrollY/X change if
    applicable, similarly double-check is naturalHeight/Width
    changes does the trigger without using setTimeout
  - input:file,select
  - checkIsValidUtils.isExpanderAttr() <- make similar to prevent takes of "$type", "$inherit", "$observe"
  - checkAndThrowErrorAttrAsTake
  - LAID.Many.remove()
  - test Textarea
  - test Image
  - test Video
  - test Canvas
  - refactor many key to be above props key
  - website


  spec:
  - Many.rowsUpdate()
  - many.rows can take array of non-objects
  - Add "$i" index for Many to spec
  - formation spec (include part for creating formations)
  - add LAID.level.changeNativeInput/ScrollX/Y() to spec
  - $centerX, $centerY, $right, $bottom
  - update spec to have quotes around state names
  - filter.end() ?
  - $filtered and $all
  - queryAll, queryFiltered

  todomvc:
  - delete item
  - check all to complete
  - routing


Future:
  - $browser attr
  - $url attr
  - LAID.transparent() -> LAID.transparent ?
  - "*/" to reach row level from descendant level
  - selective inheritance where part of lson is inherited
    eg: ($inherit: [{level:"../Button", keys: ["props", "when"]}] )
  - try to remove AttrVal.forceRecalculation()
  - CSS pointer-events optimization
  - HTML5 aria
  - takes across forbidden objects such as "when", "transition", etc
  - natural width and height dependent upon the rotation of Z axis of children.
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


cry about:
  - poor scrolling GPU performance: http://indiegamr.com/ios-html5-performance-issues-with-overflow-scrolling-touch-and-hardware-acceleration/
  - "-moz-user-select" unactivated from JS

research:
  - http://jsperf.com/origin-px-vs-percent
