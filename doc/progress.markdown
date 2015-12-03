
Current:
  - checkisdependent optimization
  - $one for many
  - custom when events
  - text calculation innercss optimize
  - fix safari
  - complete reorder example
  - defaultize many lson fargs which are mentioned in states but
    not otherwise
  - automatically id-fy when rows are given without id
  - naturalwidth/height for image
  - what is "$hovering" or any of the event binding events
    is called from attr() after having themselves deferenced
    then what happens?
  - todoMVC Learn section
  - transition multiple props comma separated, eg: "textColor, left, opacity"
  - many.rows inheritance
  - < state >.bottom/right/centerX/centerY
  - filter.end()
  - add all remaining filter/fold takes
  - function to get all partLevelS from many?
  - height/width change should trigger scrollY/X change if
    applicable, similarly double-check is naturalHeight/Width
    changes does the trigger without using setTimeout
  - input:file
  - checkIsValidUtils.isExpanderAttr() <- make similar to prevent takes of "$type", "$inherit", "$observe"
  - checkAndThrowErrorAttrAsTake
  - "*/" to reach row level from descendant level
  - LAY.Many.remove()
  - add copyright to js files
  - test Textarea
  - test Image
  - test Video
  - test Canvas
  - test Filter
  - netflix example
  - website


  spec:
  - Many.rowsUpdate()
  - many.rows can take array of non-objects
  - Add "$i" index for Many to spec
  - formation spec (include part for creating formations)
  - add LAY.level.changeNativeInput/ScrollX/Y() to spec
  - $centerX, $centerY, $right, $bottom
  - update spec to have quotes around state names
  - filter.end() ?
  - $filtered and $all
  - queryAll, queryFiltered

Future:
  - $browser attr
  - $url attr
  - IE ms-filter
  - IE7 text width issue
  - optimize by putting "right" and "bottom" at end (or atleast after left, top, width, and height) of recalculate attr list
  - < img > srcset
  - LAY.transparent() -> LAY.transparent ?
  - selective inheritance where part of lson is inherited
    eg: ($inherit: [{level:"../Button", keys: ["props", "when"]}] )
  - try to remove AttrVal.forceRecalculation()
  - CSS pointer-events optimization
  - CSS will-change optimization
  - HTML5 aria
  - takes across forbidden objects such as "when", "transition", etc
  - natural width and height dependent upon the rotation of Z axis of children.
  - move `eventReadonlyEventType2boundFnHandler` outside of AttrVal (move to Level) to save space
  - Add/interface HTML history module support
  - change 'audio/videoControl"s"' to 'audio/videoControl' to respect naming convention of props?
  - Add $time as a read only property of root '/'
  - $numberOfChildren
  - $numberOfDisplayedChildren
  - feature function which checks for overlapping parts
  - Add support for other HTML5 input types
  - 'when' for formation, it should include function handler for insertion of new item into the formation alongwith deletion.
  - LAY.Color mix


cry about:
  - poor scrolling GPU performance: http://indiegamr.com/ios-html5-performance-issues-with-overflow-scrolling-touch-and-hardware-acceleration/
  - "-moz-user-select" unactivated from JS

research:
  - http://jsperf.com/origin-px-vs-percent
