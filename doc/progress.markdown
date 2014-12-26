
Current:
  - Undefine active props and when attrs when changing states
  - Level.$update/changeState (Also fix LSON.Level.$inherit, also create a LSON.$inheritState (or LSON.$inherit with arg specifying state))
  think about introducing a way to prevent same render methods from being repeatedly called
  - In LSON.Part add 'div'/<other html node dependent of type> node creation. (Add Psuedo defaults to element node in LSON.Part)
  - Add support for psuedo defaults, and add the details to the spec (handle mixed psuedo properties like perspectiveOrigin and background)
  - Add support for $scrollX, $value, $naturalWidth and other input properties, and dont forget to bind 'scrollX' to '$scrollX', etc, etc.
  - Thinking about duplications within data which can be color
  - Add $time as a read only property of root '/'
  - Add will-observe (array-valued) prop to lson root
  - Circular reference delay lists (within AttrValue prototype methods)
  - Insert CSS from entry.js
  - Add link defaults
  - Add/interface HTML history module support
  - LSON.level
  - LSON.Level.attr()
  - Dont allow (by throwing on error on disobidience) the use of attr references
  - LSON.Many ( + LSON.takeMany)
  - todoMVC preliminary  
  - dataTravel
  - todoMVC final  
  - Change dateNow to performanceNow
  - Add support for adding more children (got to be careful with naturalWidth and naturalHeight here)
  - Add animation support with "position" macro prop
  - Change conole.error to throws for lson errors

Tests:
  - For illegal take references to expander props or expander props mentioned as takes



Future:
  - Introduce order number key for states
  - feature function which checks for overlapping parts
hardware acceleration flag
  - Add constraint which tells you the (x, y) co-ordinates of the mouse position (use observe list for level '/' to activate)
  - Add support for radio buttons and other HTML5 input types
  - CSS backface-visibility prop
  - CSS will-change
  - optimization: check all the props possible within the level (by checking root and the states) and only set defaults for those which are going to be used (make sure you include important superdefaults such as originX, originY,etc which come into the calculation)
  - 'when' for formation, it should include function handler for insertion of new item into the formation alongwith deletion.
  - Opacity to 0.999999 research and implementation within LSON
  - LSON.Color mix
  - Expand out object-typed data values
