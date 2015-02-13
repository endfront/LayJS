




Current:
  - rotate not wokring
  - check if transition is actually completed in a delay onyl transition such as zindex
  - transition of TEXT when app has started!
  - update spec about  "gpu" and "all",
      and possibly remove "filters" and "positional"
  - update spec to have quotes around state names
  - transition spring
  - $absoluteLeft/Top
  - dataTravel
  - change name of 'valUsedForLastRecalculation' to 'prevVal'
  - introduce "all" transition and "all_minus_color"



  many:
  - Check misspelling in event read only (eg $hoverd instead of $hovered)
  - LAID.Many ( + LAID.takeMany)
  - Cache most recently used state combinations for Many
  - removeLevel
  - lson.type
  - Add "$i" index for Many to spec
  - Refine formation spec (including for creating formations)
  - todoMVC
  - Upload to github (with new .git object)

Tests:
  - valid level name
  - For illegal take references to expander props or expander props mentioned as takes
    - transition.attr
    - transition
    - when
    - when.eventType
    - inherits
    - props
    - filters
    - border
  - Inherit
      - one and two inherit (from external)
      - one (one from child, one from neighbour) and two inherit (from within)
      - two inherit (from external and within)
  - Normalize
      - lazy prop
      - border decompression (check $$num)
      - multiple type (boxShadows) decompression (check $$max)
      - multiple type (boxShadows) decompression (existing within
        root and state where state number exceeds)(check $$max)
      - multiple type (boxShadows) decompression (existing within
          states and not root)(check $$max)

  - when
    - check clicked

  - SLSON (state inherit)
    - check if alphabetical order is maintained
    - check state hashed cache working

  - Take
    check divide, multiply, add.... all others

  - state
    - valid state name
    - check state changes on onlyif invoke (and check install works)
    - check state changes on onlyif uninvoke (and checkk uninstall works)

  - load
    - check load works

  - render
    - check basic render properly like height from node

  - lazy attributes
    - state based
    - readonly based





Future:
  - Insert CSS from entry.js (normalize.css CSS)
  - move `eventReadonlyEventType2boundFnHandler` outside of AttrVal (move to Level) to save space
  - Add/interface HTML history module support
  - change 'audio/videoControl"s"' to 'audio/videoControl' to respect naming convention of props?
  - Add $time as a read only property of root '/'
  - Canvas support
  - Convert between transition and calc when transition add/delete
  - Introduce order number key for states
  - feature function which checks for overlapping parts
hardware acceleration flag
  - Add constraint which tells you the (x, y) co-ordinates of the mouse position (use observe list for level '/' to activate)
  - Add support for radio buttons and other HTML5 input types
  - CSS backface-visibility prop
  - CSS will-change
  - optimization: check all the props possible within the level (by checking root and the states) and only set defaults for those which are going to be used (make sure you include important superdefaults such as originX, originY,etc which come into the calculation)
  - 'when' for formation, it should include function handler for insertion of new item into the formation alongwith deletion.
  - Opacity to 0.999999 research and implementation within LAID
  - LAID.Color mix
  - Expand out object-typed data values
