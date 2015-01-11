




Current:
  - Add support for psuedo defaults, and add the details to the spec (handle mixed psuedo properties like perspectiveOrigin and background)
  - Add will-observe (array-valued) prop to lson root
  - Add $time as a read only property of root '/'
  - render function
  - In LAID.Part add 'div'/<other html node dependent of type> node creation. (Add Psuedo defaults to element node in LAID.Part)
  - Add support for $scrollX, $value, $naturalWidth and other input properties, and dont forget to bind 'scrollX' to '$scrollX', etc, etc.
  - Thinking about duplications within data which can be color
  - Change passing in "/" lson in LAID.run()
  - Insert CSS from entry.js
  - Add link defaults
  - Change dateNow to performanceNow
  - Change console.error to throws for LAID errors
  - LAID.level()
  - LAID.Level.attr()
  - LAID.Level.data() (change)
  - inherit after data change? should be fine because you change attr2attrval
  - dataTravel
  - (tentative) Add/interface HTML history module support




  many:
  - LAID.Many ( + LAID.takeMany)
  - Add "$i" index for Many to spec
  - Refine formation spec (including for creating formations)
  - todoMVC
  - Upload to github (with new .git object)

Tests:
  - For illegal take references to expander props or expander props mentioned as takes



Future:
  - Cache most recently used state combinations (further optimize for many parts)
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
