There are 3 ways an attr can be modified:
  - through a key change by a state
  - though initialization of the attr
  - through a modification of an attr it is taking (which could have its source in either or both of the above 2)

Steps of initializations:
  - init AttrValue for every attr
  - take other levels for every AttrValue
  - calculate (without propagating) every (if it has not been calculated already)
   other AttrValue. If an AttrValue is a taker then first
   calculate its dependencies before propagating.

How an AttrValue is changed:
  - (optional) an update to the value of the AttrValue is done
  - a reCalculate request is made to the AttrValue
  -




Algorithm of event loop

  for level in dirty(level).reverse()
    isNoTransitionLeft = true
    for attr in dirty(level,attr).reverse()
      if attr.transition !== undefined:
        attr.transitionCalcValue = attr.transition(timeDelta)
        if attr.transition.isComplete:
          dirty(level, attr).pop()
        else:
          isNoTransitionLeft = false
        if attr.renderProp:
          level.renderFn_<renderProp>()
      else:
        dirty(level, attr).pop()
        if attr.renderProp:
          level.renderFn_<renderProp>()
    if isNoTransitionLeft:
      dirty(level).pop()







When (implementation)

root
  click
    fnA
    fnB

state1
  click
    fnX

state2
  click
    fnP

root
  total = 2
  click1 = fnA
  click2 = fnB


root+state1
  total = 3
  click1 = fnA
  click2 = fnB
  click3 = fnX

root+state2
  total = 3
  click1 = fnA
  click2 = fnB
  click3 = fnP


During normilization: total is created, and all events are collected to make a hashmap of corresponding lists
During inheritance: total stacks up, and list stacks up
During change:

When an AttrValue is changed:

TODO:


Current:
  - Fix flattenAttr, add options for preserving object information for transition and maybe length for when
  - transition and when normalization, boil down to single string attrs? (then clear out object attrs eg: {when:click:[fn1]} since
    we have when.click1 exists)
  - think about when.click1 should point to when.click
  - Remove $initAttrsArray
  - Think about pre-initializing all undefined props in root state
  - LAID.Level.addChildren after inherit as additonal children are added?
  - (create map for renderFn ) check is .stateContainedAttr before  trying to call renderFn, in order to reduce the chance of a miss
  - argument passing to renderFn (to distinguish between "click" and "keydown" for when?)
  - Update state solve calculation (first update each attr, add to list and then selectively append (if changed) to list to solve)
  - When decompression
  - AttrValue.renderableName
  - LAID.Part.prototype.$renderFn_positionX = renderPositionNonGpuX; in Part.js for < IE 8
  - Add psuedo defaults for multiple-type prop to SPEC! (good news, eg: spread for boxShadows)
  - Remove isTransitioning and replace with transition object as Take Objects, and also Transition string options (add this all to
    the spec)
  - Transition custom parameters (eg viscosity) passing through object (add in spec)
  - When changing attr, return true if it results in state change, false otherwise (so that Level.$updateStates can halt if the state
    was indeed changed)
  - Think of moving control of `Level.dirtyAttrS` into `AttrValue` (DIRTY WITHIN INITIALIZATION OF AttrValue?)
  - Level.$update/changeState (Also fix LAID.Level.$inherit, also create a LAID.$inheritState (or LAID.$inherit with arg specifying state))
  - Change passing in "/" lson in LAID.run()
  - think about introducing a way to prevent same render methods from being repeatedly called
  - In LAID.Part add 'div'/<other html node dependent of type> node creation. (Add Psuedo defaults to element node in LAID.Part)
  - Add support for psuedo defaults, and add the details to the spec (handle mixed psuedo properties like perspectiveOrigin and background)
  - Add support for $scrollX, $value, $naturalWidth and other input properties, and dont forget to bind 'scrollX' to '$scrollX', etc, etc.
  - Thinking about duplications within data which can be color
  - Add $time as a read only property of root '/'
  - Add will-observe (array-valued) prop to lson root
  - Circular reference delay lists (within AttrValue prototype methods)
  - Insert CSS from entry.js
  - Add "$i" index for Many to spec
  - Refine formation spec
  - Add link defaults
  - Add/interface HTML history module support
  - LAID.level()
  - LAID.Level.attr()
  - Dont allow (by throwing on error on disobidience) the use of attr references
  - LAID.Many ( + LAID.takeMany)
  - todoMVC preliminary  
  - dataTravel
  - todoMVC final  
  - Change dateNow to performanceNow
  - Add support for adding more children (got to be careful with naturalWidth and naturalHeight here)
  - Add animation support with "position" macro prop
  - Change conole.error to throws for LAID errors
  - Upload to github (with new git repo)

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
