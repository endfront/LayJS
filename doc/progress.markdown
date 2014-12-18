
Current:
  - deciding if when key should duplicate for inherits (you were essentially stepping through the 2 use-cases of inherits), inherit rules to spec, fix inherit, also fix LSON.Level.$inherit, also create a LSON.$inheritState (or LSON.$inherit with arg specifiying state)
  - add to spec warning that multiple props don't come with defaults, order of transformation
  - How to disable value less html properties? (check if when using javascript you set to null and/or false it goes away?)
  - Add numeric psuedo prop for multiple props (eg filters, boxShadows, etc) (Make sure numberic psuedo prop all have non null props in attr2attr2value )
  - Check support for css value (ie8 and below) 'rgba' in render functions
think about introducing a way to prevent same render methods from being repeadedly called
  - Add $time as a read only property of root '/'
  - Add observe (array-valued) prop to lson root
  - Circular reference delay lists (within AttrValue prototype methods)
  - Level.$update/changeState
  - Support for $<observe> properties with ($naturalWidth/Height, $numChildren, $numDisplayedChildren)
  - Insert CSS from entry.js
  - Add link defaults
  - Add/interface HTML history module support
  - LSON.level
  - LSON.Many ( + LSON.takeMany)
  - todoMVC preliminary  
  - dataTravel
  - todoMVC final  
  - Change datenow to performancenow


Future:
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
