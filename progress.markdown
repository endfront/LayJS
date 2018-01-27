
Current:
  - format with dict not working for website gradient example
  	backgroundImage: LAY.take("repeating-linear-gradient(310deg, #{purpleTheme}, #{purpleTheme} 50px, \
				#{darkPurpleTheme} 50px , #{darkPurpleTheme} 100px )").format(
					{
						purpleTheme: LAY.take("/", "data.purpleTheme"),
						darkPurpleTheme: LAY.take("/", "data.purpleTheme").colorDarken(0.04)
					}
			),
  - colorequals
  - inherit within inherit (object)
  - make lson readonly (i.e makes clones of color and objects.
    addChildren duplicate data/row (use lson for readonly)
  - change native input causestextarea resize not to happen immediately (check file:///Users/raj/git/LayJS/LayJS/tmp/autosizetextarea/index.html)
  - add $extfonts, $page, $view to lazy level
  - repeat ids should throw error
  - delay causes animation problems
  - filter (many-type prop) defaults
  - LAY.Take.markdown method
  - color name direct convert from string
  - (tmp/video.html) lazy defaultize many lson fargs which are mentioned in states but not otherwise
  - what if "$hovering" or any of the event binding events
    is called from attr() after having themselves deferenced
    then what happens?
  - checkIsValidUtils.isExpanderAttr() <- make similar to prevent takes of "$type", "$inherit", "$obdurate"
  - remove link type, link and image within same level
  - error: check if explicit type such as "html" has no given prop
  - error: undefined text string val (ie not a string)
  - error: unknown formation known
  - update format string doc (option for object argument)
  - row key has take (should update "rows" attr)
  - states.<state>.onlyif should refer to <state>.onlyif

  spec:
  - $hash, $pathname, etc
  - Add "$i" index for Many to spec
  - formation spec (include part for creating formations)
  - add LAY.level.changeNativeInput/ScrollX/Y() to spec
  - update spec to have quotes around state names

  zones:
  - "^Create/Poll")
  - do coded create turf (coloring off)


Future:
  - lazy initiation for root state prop
    (eg:"root.textSize" === "textSize")
  - test for popstate (url) change
  - add "style" prop
  - add input range
  - switching between exist bug (zone app)
  - take.replace
  - lay.take testing
  - image without height/width
  - naturalWidth/Height of video
  - add input range
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

Complain:
  - poor scrolling GPU performance: http://indiegamr.com/ios-html5-performance-issues-with-overflow-scrolling-touch-and-hardware-acceleration/
  - "-moz-user-select" unactivated from JS
