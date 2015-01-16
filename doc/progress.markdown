




Current:
  - `defaultCss` in Part.js (you were at `background`)
  - In LAID.Part add 'div'/<other html node dependent of type> node creation. (Add Psuedo defaults to element node in LAID.Part) (remember
  - move element (node) creation to requestAnimationFrame
  - State install / uninstall and load
    document.body node for root)
  - $natualWidth, $naturalHeight ... other read-onlys
  - Change passing in "/" lson in LAID.run()
  - Insert CSS from entry.js
  - Add link defaults
  - Cache most recently used state combinations for Many
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
