


SPRINT:
  - FIX dataTravel arrive
  - ADD 5 test cases
  - ADD 15 test cases
  - ADD Level.addChildren()
  - ADD Level.remove()
  - ADD Level.clog()
  - DOQUARTER many
  - DOHALF many
  - DOQUARTER many (queries)



Current:
  - dataTravel $readOnlys
  - fix delta arrive FALSE
  - update data travelling example in spec, whereby "mousedown" is together
  with "movemove" and "mouseup" within the same state
  - safari click (menu) not working
  - input
  - $absoluteLeft/Top
  - mention about single argument takes (LAID.take(true)) in spec
  - divide nondisplay tests into "runtime" and "nonruntime"
  - LAID.Color in spec


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



Future:
  - update spec to have quotes around state names
  - natural width and height dependent upon the rotation of Z axis of children.
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
