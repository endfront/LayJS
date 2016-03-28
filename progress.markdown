
Current:
  - $load not working on on part
  - $xfonts, recalculate without animation
  - markdown lay.take method
  - .md link convert to .html link
  - (tmp/video.html) lazy defaultize many lson fargs which are mentioned in states but not otherwise
  - what if "$hovering" or any of the event binding events
    is called from attr() after having themselves deferenced
    then what happens?
  - checkIsValidUtils.isExpanderAttr() <- make similar to prevent takes of "$type", "$inherit", "$obdurate"
  - remove link type, link and image within same level
  - error: check if explicit type such as "html" has no given prop
  - error: undefined text string val (ie not a string)
  - error: unknown formation know
  - update format string doc (option for object argument)

  spec:
  - $hash, $pathname, etc
  - Add "$i" index for Many to spec
  - formation spec (include part for creating formations)
  - add LAY.level.changeNativeInput/ScrollX/Y() to spec
  - update spec to have quotes around state names
  - filter.finish() ?
  - queryAll, queryFiltered

Future:
  - test for popstate (url) change
  - add "style" prop
  - switching between exist bug zone
  - take.replace
  - lay.take testing
  - image without height/width
  - naturalwidth/height of video
  - font loading
  - LAY.Many.rowsMap(fn, query)
  - exist delay
  - LAY.view method
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
