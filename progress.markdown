
Current:
  - startswith, endswith lay.take testing
  - common string and array take methods
  - add test command from within gulp
  - transition multiple props comma separated, eg: "textColor, left, opacity"
  - naturalwidth/height of video
  - $load cascading
  - input:file
  - lazy defaultize many lson fargs which are mentioned in states but not otherwise
  - what is "$hovering" or any of the event binding events
    is called from attr() after having themselves deferenced
    then what happens?
  - checkIsValidUtils.isExpanderAttr() <- make similar to prevent takes of "$type", "$inherit", "$obdurate"


  spec:
  - Add "$i" index for Many to spec
  - formation spec (include part for creating formations)
  - add LAY.level.changeNativeInput/ScrollX/Y() to spec
  - update spec to have quotes around state names
  - filter.finish() ?
  - queryAll, queryFiltered

Future:
  - investigate "-text-size-adjust"
  - allow state name "all"
  - formation dict? {x,y,z,rotateX,rotateY,rotateZ,skewX,skewY, scaleX, scaleY}
  - grid formation fill vertically, vgrid?
  - fix bug of rows containing duplicate objects
  - objectEqual(a, b, m) [remove 3rd arg m]
  - check for illegal characters id row.id val
  - take.colorRed -> take.colorSetRed? or take.colorGetRed? (clarify)
  - video controls $readonly (eg: $videoMuted)
  - IE ms-filter
  - IE7 text width issue
  - optimize by putting "right" and "bottom" at end (or atleast after left, top, width, and height) of recalculate attr list
  - < img > srcset
  - LAY.transparent() -> LAY.transparent ?
  - selective inheritance where part of lson is inherited
    eg: ($inherit: [{level:"../Button", keys: ["props", "when"]}] )
  - CSS pointer-events optimization
  - CSS will-change optimization
  - HTML5 aria
  - natural width and height dependent upon the rotation of Z axis of children.
  - move `eventReadonlyEventType2boundFnHandler` outside of AttrVal (move to Level) to save space
  - Add $time as a read only property of root '/'
  - $numberOfChildren, $numberOfDisplayedChildren
  - Add support for other HTML5 input types
  - 'when' for formation, it should include function handler for insertion of new item into the formation alongwith deletion.
  - LAY.Color mix


Complain:
  - poor scrolling GPU performance: http://indiegamr.com/ios-html5-performance-issues-with-overflow-scrolling-touch-and-hardware-acceleration/
  - "-moz-user-select" unactivated from JS
