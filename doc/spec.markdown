< <  Warning: This is the specification which is not to be read as a tutorial for LSON > >


### LSON

LSON - > Layout Syntax Object Notation


### LSON methods

  LSON.run()
  LSON.level()
  LSON.many()
  LSON.part()
  LSON.take()
  LSON.takeMany()

  LSON.rgb()
  LSON.rgba()
  LSON.hsla()
  LSON.hsl()
  LSON.color()


### LSON.run


    LSON.add([optional: root properties (object)], {
        "Name": {

          type: string,
          inherits: string | object,
          data: object | array | string | number,
          props: object,
          when: object,
          transition: transitionObj,
          many: {
              data: object,
              props: {
                  formation: string,
                  sort: array | string,
                  order: string,
                  id: string (constant)
                  ...
              },
              transition: transitionObj,
              states: {
                  props: object
                  < name >: {
                      props: object,
                      onlyif: LSON.Take,
                      transition: transitionObj,
                      install: function,
                      uninstall: function
                  }
              },
          },
          states: {
              < name >: {
                  props: object,
                  when: object,
                  onlyif: LSON.Take,
                  transition: transitionObj,
                  install: function,
                  uninstall: function
              }
          },
          children: object

          }
      })


### type

  `string`
  **constant**
  Type of Part:
    "none"
    "text" (auto-detect is on)
    "image"
    "video"
    "audio"
    "canvas"
    "svg"
    ( inputs ...)
    "input:singleline"
    "input:multiline"
    "input:button"
    "input:select"
    "input:option"
    "input:optgroup"
    "input:< any other valid input[type] html property i.e file, color, date, etc >"




### inherits

Type: `String` | `Array of Strings`
Constant: *Yes*


### data


Type: `Object`



### props

Type: `Object`

The keys within `props` are predefined

##### List of props



- originX
  `number`
  in fraction (percent)
  Default: 0.5

- originY
  `number`
  in fraction (percent)
  Default: 0.5

- originZ
  `number`
  in fraction (percent)
  Default: 0

- perspective
  `number`
  In pixels
  Psuedo-Default: 0

- perspectiveOriginX
  `number`
  in fraction (percent)
  Psuedo-Default: 0.5

- perspectiveOriginY
  `number`
  in fraction (percent)
  Psuedo-Default: 0.5

- top
  `number`
  Default: 0

- left
  `number`
  Default: 0

- right
  `number`
  Default: null

- bottom
  `number`
  Default: null

- centerX
  `number`
  Default: null

- centerY
  `number`
  Default: null

- z
  `number`
  In pixels
  Default: 0


- width
  `number`
  Width of part (excluding scale)
  Default: LSON.take('this', '$naturalWidth')

- height
  `number`
  Height of part (excluding scale)
  Default: LSON.take('this', '$naturalHeight')

- opacity
  `number`
  Psuedo-Default: 1


- overflowX
  `string`
  CSS overflow property
  Psuedo-Default: 'visible'

- overflowY
  `string`
  CSS overflow property
  Psuedo-Default: 'visible'


- scrollX
  `number`


- scrollY
  `number`


- cursor
  `string`
  CSS cursor property
  Psuedo-Default: 'default'


- background (no support for multiple backgrounds)
  {
    color: LSON.Color (Psuedo-default: LSON.transparent()),
    image: string,
    attachment: string (CSS background-attachment)
    repeat: string (CSS background-repeat),
    size: string (CSS background-size),
    position: string (CSS background-position)
   }


- boxShadows
  *multiple type prop*
  [
    {
      inset: boolean
      x: number (in pixels),
      y: number (in pixels),
      blur: number,
      spread: number,
      color: LSON.Color
    }
    ...
  ]

- shiftX
  `number`
  Additional x translation
  Default: 0


- shiftY
  `number`
  Additional y translation
  Default: 0

- shiftZ
  `number`
  Additional z translation
  Default: 0


- scaleX
  `number`
  Units to scale X
  Default: 1


- scaleY
  `number`
  Units to scale Y
  Default: 1

- scaleZ
  `number`
  Units to scale Z
  Default: 1


- rotateX
  `number`
  In degrees
  Default: 0


- rotateY
  `number`
  In degrees
  Default: 0


- rotateZ
  `number`
  In degrees
  Default: 0


- skewX
  `number`
  In degrees
  Default: 0

- skewY
  `number`
  In degress
  Default: 0



- cornerRadius
  `number`
  Shorthand for `cornerRadiusTopLeft`, `cornerRadiusTopRight`, `cornerRadiusBottomRight`, `cornerRadiusBottomLeft`


- border
  Shorthand for border < Top/Right/Bottom/Left >< Style/Color/Width >
  { top/right/bottom/left/< undefined >: {
    style: string (CSS border-style),
    color: LSON.Color,
    width: number

  } }

  filters
  *multiple type prop*
  [
    [  
      type: "url" | "blur" | "brightness" | "contrast" | "dropShadow" | "grayscale" | "hueRotate" | "invert" |
            "opacity" | "saturate" | "sepia",  
      blur: number (in pixels) |
      brightness: number (in fraction (percent)) |
      contrast: number (in fraction (percent)) |
      dropShadow: {
        x: number (in pixels) ,
        y: number (in pixels) ,
        blur: number (in pixels),
        color: LSON.Color
      } |
      grayscale: number (in fraction (percent)) |
      hueRotate: number (in degrees) |
      invert: number (in fraction (percent)) |
      opacity: number (in fraction (percent)) |
      saturate: number (in fraction (percent)) |
      sepia: number (in fraction (percent)) |
      url: string

    ]
    ...
  ]



- text
  `string`

- textSize
  in pixels
  `number`
  Psuedo-Default: 13

- textFamily
  `string`
  CSS font-family
  Psuedo-Default: 'sans-serif'

- textWeight
  `string`
  CSS font-weight
  Psuedo-Default: 'normal'

- textColor
  `LSON.Color`
  Psuedo-Default: LSON.color("black")


- textShadows
 *multiple type prop*
  [
    {
      x: number,
      y: number,
      blur: number,
      color: LSON.Color
    }
    ...
  ]



- textVariant
  `string`
  CSS font-variant
  Psuedo-Default: 'normal'

- textStyle
  `string`
  CSS font-style
  Psuedo-Default: 'normal'


- textDecoration
  `string`
  CSS text-decoration
  Psuedo-Default: 'none'

- textAlign
  `string`
  CSS text-align
  Psuedo-Default: 'left'


- textLetterSpacing
  `number` / `null`
  In pixels. null for native letter spacing.


- textWordSpacing
  `number` / `null`
  In pixels. null for native word spacing.


- textOverflow
  `string`
  CSS text-overflow
  Psuedo-Default: 'normal'


- textIndent
  `number`
  Psuedo-Default: 0

- textWhitespace
  `string`
  CSS white-space
  Psuedo-Default: 'normal'



- textPadding
  `number`
  Border box padding.
  Shorthand for `textPaddingTop`, `textPaddingRight`, `textPaddingBottom` and `textPaddingLeft`
  Psuedo-Default: 0


- inputLabel
  `string`
  Default: ""

- inputRows
  `number`
  Rows for textarea
  Psuedo-Default: 2

- inputText
  `string`
  Default: ""


- inputPlaceholder
  `string`

- inputAutocomplete
  `boolean`
  Psuedo-Default: true


- inputAutocorrect
  `boolean`
  Psuedo-Default: true

- inputDisabled
  `boolean`
  Psuedo-Default: false



- linkHref
  `string`
  Psuedo-Default: null

- linkRel
  `string`
  HTML a[rel]
  Psuedo-Default: ""

- linkDownload
  `boolean`
  Psuedo-Default: false

- linkTarget
  `string`
  HTML a[target]

- imageUrl
  `string`


- videoSources / audioSources
  *multiple type prop*
  [
    {
      type: string ( html5 < source > type ),
       src: string ( html5 < source > src )
    },
    ...
  ]

- videoTracks / audioTracks
  *multiple type prop*
  [
    {
      default: boolean (default: false),
      kind: string ( html5 < track > kind ) (default: ""),
      label: string ( html5 < track > label ) (default: ""),
      src: string ( html5 < track > src ) (default: ""),
      srclang: string ( html5 < track > srclang ) (default: "")
    },
    ...
  ]


- videoAutoplay
  `boolean`
  Psuedo-Default: false


- videoControls / audioControls
  `boolean`
  Psuedo-Default: true


- videoCrossorigin
  `string`
  html5 < video > crossorigin
  Psuedo-Default: "anonymous"


- videoLoop / audioLoop
  `boolean`
  Psuedo-Default: false


- videoMuted / audioMuted
  `boolean`
  Psuedo-Default: false



- videoPreload / audioPreload
  `string`
  html5 < video >/< audio > preload
  Psuedo-Default: 'auto'


- videoPoster
  `string` / `null`
  Psuedo-Default: null


- audioVolume
  `number`
  Psuedo-Default: 0.7



### LSON many

Type: `Object`



### LSON states

object containing states

### LSON children

children levels


### LSON when

contains events as keys, and values as a callback function or
arrays of callback functions (order respected)

example with a single callback function specified:

    LSON.start({
        Box: {
          props: {
            text: "Hello World"
          },
          when: {
            click: function() {
                console.log( "Hello \n World!" );
              }
          }
        }
    })

example with multiple callback functions specified (with the aid on array):

    LSON.start({
      Box: {
        props: {
          text: "Hello World"
          },
          when: {
            click: [
              function() {
                console.log( "Hello" );
              },
              function() {
                console.log( "World!" );
              }
            ]
          }
        }
    })



### LSON.Level

To get the LSON.Level:

  LSON.level(level) // fetches level
  LSON.level(< LSON.Part reference >, level) // fetches level wrt reference

LSON.Level methods:

  attr( attr ) //gets attr value
  data( changedData, [, stateTransitionObj ] ) //changes data value



### Constraints Available (Known as "attributes")

The below values can be directly accessed through
the LSON Level through `.attr(< access key >)`
The same access keys are used as the 2nd argument in LSON.Take

  - <prop>

  - data.<data>

  - when.<event><num>

  - transition.<attr><duration/delay/done>

  - state.<state>
  returns true if state is active

  - <state>.<prop>

  - <state>.when<event><num>

  - <state>.transition.<attr><duration/delay/done>

  - <state>.onlyif

  - <state>.install

  - <state>.uninstall





  - read only properties (prefix: $)
    - $dataTravelling (`boolean`)

    - $dataTravelledDelta (`number`)

    - $naturalWidth (`number`)
      Width of the part occupied by text if its a text element, image if its an image element,
      otherwise if a view then the width occupied by the children parts.

    - $naturalHeight (`number`)
      Height of the part occupied by text if its a text element, image if its an image element,
      otherwise if a view then the height occupied by the children parts.


    - $numberOfChildren (`number`)
      Number of the direct descendant parts of the given part.

      < !--
    - $numberOfDisplayedChildren (`number`)
      Number of the direct descendant parts of the given part which have display set to true.
      -- >

    - $focused (`boolean`)

    - $clicked (`boolean`)

    - $hovered (`boolean`)

    - $scrolledX (`number`)

    - $scrolledY (`number`)

    - $cursorX (`number`)

    - $cursorY ('number')

    - $inputText (`string`)

    - $inputChecked (`boolean`)

    - $inputSelected (`boolean`)






### LSON.take & LSON.Take

creates LSON.Take object:

  LSON.take(level, property)

or

  LSON.take(property) //this will refer to self


LSON.Take methods

  - add,subtract,divide,multiply
  - remainder
  - half, double
  - min, max
  - ceil, floor, abs, negative, sin, cos, tan
  - log, pow
  - negative, positive (unary operators)
  - index, length (for array)
  - key (for dict)
  - method (invokes a method and returns the return)
  - concat (for string)
  - fn (context `this` is the `Level`)
  - format, i18nFormat
  - (LSON.Color) colorLighten, colorDarken, colorSaturate, colorDesaturate, colorContrast, colorGrayscale, colorAlpha, colorRed, colorGreen, colorBlue, colorInvert, colorHue, colorLightness, colorSaturation
  - (these return booleans) exactly, eq, gt, lt, gte, lte, not, contains
  - (these return booleans) and, or, xor
  - (these return booleans) match (for regex)


  takes one argument, either:
    - LSON.Take object
    - anything else

  LSON.take(level, property).add(10).divide(LSON.take(level2,property2)).subtract(10).multiply(1.2)
  LSON.take(level, property).min(LSON.take(level2,property2), 20, 30)
  LSON.take("foo:%s, bar:%s, baz:%s").format(LSON.take(level1, prop1), LSON.take(level2, prop2), LSON.take(level3, prop3) )
  LSON.take(function).fn(LSON.take(level1, prop1), LSON.take(level2, prop2), LSON.take(level3, prop3), function( arg1, arg2, arg3 ) {
    return something
  })
  LSON.take('/', 'data.lang').i18nFormat(
  {
    lang-code: formattable string
    .....
  },
  LSON.take(level1, prop1), LSON.take(level2,prop2)
  )


LSON.takeMany

  For queries:

  LSON.takeMany( level, queryObject )

  available methods:
  - length()
  - one() (yields a take object)


  LSON.takeMany("/Lab/Patient, {"data.age": {$gt:25}, "data.diabetes": {$eq: true} }).length()

  LSON.takeMany("/BuyHosting/Plan", { "data.selected":true } }).one("data.price")


### LSON.Color (LSON.rgb, LSON.rgba, LSON.hsl, LSON.hsla, LSON.color)

LSON.rgb(r,g,b)   (r,g,b:[0,255])
LSON.rgba(r,g,b,a) (r,g,b:[0,255], a:[0,1])
LSON.hsl(h,s,l)   (h:[0,240], s,l: [0,1])
LSON.hsla(h,s,l,a) (h:[0,240], s,l,a: [0,1])
LSON.color(name)  [name: XML recognized color]
LSON.transparent()



eg of take with color:

  color: LSON.take('header', 'color').colorDarken(0.5)
  color: LSON.rgb(100, LSON.take('this','data.green'),200).colorLighten(0.1)



### Order of Transformation

Scale -> Position -> Skew -> Rotate


### LSON inherits

    LSON.run({
      "BigBox": {
        inherits: < level string >
      }
    })

or

    LSON.run({
      "BigBox": {
        inherits: < object reference >
      }
    })


also together using an array (the order of the array is respected from left to right)

  LSON.run({
    "BigBox": {
      inherits: [ < object reference > | < level string >, ... ]
    }
  })


looks like:

  LSON.run({
    "BigBox": {
      inherits: [ '../Box', someBoxObject ]
    }
  })



for example:

    var box =  {
        props: {
          width: 200,
          height: 200
        },
        data: {
          foo: 10,
          bar: "toystory3"
        },
        children: {
          LeftSide: {
            props: {
              width: LSON.take('parent', 'width').half(),
              height: LSON.take('parent', 'height').half()
            }
          }
      }
    }



    LSON.run({
      "BigBox": {
        inherits: [ box ],
        props: {
          width: 300,
          height: 300
        },
        children: {
        LeftSide: {
          props: {
            backgroundColor: 'blue'
          }
        },
        RightSide: {
          props: {
            left: LSON.take('../LeftSide', 'right'),
            width: LSON.take('this', 'textWidth'),
            text: 'nothing here'
          }
          }
        }
      }
    })

becomes:

    { BigBox: {
        props: {
          width: 200,
          height: 200
        }
        data: {
          foo: 10,
          bar: "lala"
        },
        children: {
          LeftSide: {
            props: {
              width: LSON.take('parent', 'width').half(),
              height: LSON.take('parent', 'height').half(),
              backgroundColor: 'red'
            }
          }
          RightSide: {
            props: {
              left: LSON.take('prev-sibling', 'right'),
              text: 'nothing here'
            }
          }
        }
      }
    }


##### LSON inheritance rules

- events within 'when' key stacks up as an array
- the scope of `states[state]` and `many` are inherited at a further level deep
- the `many.rows` key is overwritten at the same level with clones made of each row (array) element
- all other props are overwritten at single level, and copied data values which are objects are cloned before copying over.


example of `when` stacking up:

  LSON.run({
      "Box": {
        when: {
          "click": function() {
            console.log("Box clicked");
          }
        }
      },
      "OtherBox": {
        inherits: ["Box"],
        when: {
          "click": function() {
            console.log("OtherBox clicked");
          }
        }
      }
  })

would essentially compile to:

  "OtherBox": {
    when: {
      "click": [
        function() {
          console.log("Box clicked");
        },
        function() {
          console.log("OtherBox clicked");
        }
      ]
    }
  }



### LSON references

  - Root
    ''

  - Direct
    '/Rankings/Winners/Stats'

  - Relative
    'Winners/Stats'
    '../'

  - Current
    '.'

  - Special
      - '' ('.')
      - 'this' ('.')
      - 'parent' ('../')

  - Many (by predetermined id field):
    /Page/Feed/Post:507c7f79bcf86cd7994f6c0e



### LSON states

  Reserved state name: "root"

  LSON.run({
    LeaderBoard: {
          children: {
            Nav: {
              props: {
                width:200,
                left: 0,
                backgroundColor: 'black',
                textColor:'white'
              },
              state: ['closed'],
              states: {
                closed: {
                  props: {
                    left: LSON.take('this', 'width').negative()
                  },
                  onlyif: LSON.take('this', 'data.locked').and(LSON.take('../', 'state.collapsed'))
                }
              }
            }
        }
      }
  })



States are unordered.
The inheritance mechanism governing states matches that mentioned for the `inherits` key.
onlyif is the condition for which a state needs to be activated.
Takes across states and root lson takes place by prefixing "<state name>." to the corresponding "props", "when", and "transition" keys:

LSON.run({
    Box: {
      props: {
        backgroundColor: LSON.rgba(245, 100, 145, 0.5)
      },
      states: {
        hovered: {
          onlyif: LSON.take("this", "$hovered"),
          props: {
            backgroundColor: LSON.take("this", "root.backgroundColor").colorDarken(0.8)
          }
        }
      }
    }

})



### Many


  LSON.start({
      "BioData": {
        width: LSON.take('Person'),
        children: {
          "Person": {
            width: 200,
            many: {
              data: {
                n:5
              },
              props: {
                formation:'grid',
                sort: ['name'],
                order: 'ascending',
                id: "_id"
              },
              rows: [
                {_id:'00423', name:'Eddard Stark', age: 50},
                {_id:'08383', name:'Tyrion Lannister', age: 40},
                {_id:'01919', name:'Joffrey Baratheon', age: 16}
              ]
            }
          }
      }
    }
  })




id: key which is id (cannot be changed)
first: style of the first element
sort: key (or multiple in order of sorting) to sort (can be changed) or it takes a function
done using (2nd argument a boolean representing whether the sort is in descending order)


rows

  - contains arbitrary data, which is fed into the 'data' key


example:

  {_id:'00423', name:'Eddard Stark', age: 50 },



more can be added by:

  LSON.many('/BioData/Person').more( [{id:'01010', name: 'Robb Stark', age: 32}] )


or committed (facebook react style)

  LSON.many('/BioData/Person').commit( [
    {_id:'00423', name:'Eddard Stark', age: 50},
    {_id:'08383', name:'Tyrion Lannister', age: 40},
    {_id:'01919', name:'Joffrey Baratheon', age: 16},
    {id:'01010', name: 'Robb Stark', age: 32}
  ] );


queries (mongodb style)

  LSON.many("/Lab/Patient").query({"data.age": {$gt:25}, "data.diabetes": {$eq: true} })
  LSON.many("/BuyHosting/Plan").query({ "data.selected":true } })

formation:
  `String`

formation object examples:

(1) "onebelow" formation

  LSON.formation('onebelow', {
      algorithm: function (options, prev, cur, all, index) {
        if (prev) cur.formation('top', LSON.take(prev, 'bottom'))
      }
  })




(2) "grid" formation

for grid (note that the width and height cannot be used effectively for a grid)

  LSON.formation('grid', {
      algorithm: function (options, prev, cur, all, index) {
        if (prev) {
          var row = Math.floor( index / 5 );
          var column = index % 5;
          cur.formation('left', LSON.take('this', 'width').multiply(column));
          cur.formation('top', LSON.take('this', 'height').multiply(row));
        }
      }
  })








### State Transition Object

{

  all: { duration: 100 },
  props: { duration: 300 }
  left: { duration: 200},
  top: { delay: 500 },
  opacity: { duration:2000, done: function(){ console.log("opaque") }  }

}

Each key in the state transition object except for "all" and "props" refer to an attribute.
The key is an object with 3 possible keys:
    (i) duration (of the transition)
    (ii) delay (till the start of the transition)
    (iii) done (function handler executed at the end of the transition)

"all" refers to every attribute  
"props" secludes prop-typed attributes

An attribute can be of 2 types:

  (1) Transitionable
    Any numeric attribute can be transitioned.
  (2) Non-transitionable
    Non numeric attributes such as textFamily (font fmaily) are non transitionable.
Upon transition, the duration value for its transition will be ignored, and the
new value will come into effect immediately. If a delay is required, the delay
key can be specified with a duration, implying that the value will come into
effect only after the specified delay.



##### Multiple state changes

Multiple state changes can potentially result in multiple state transition objects coming into action.
There could be a conflict in the attribute's transition between two or more state transition objects.
If such a conflict takes places, the state which is modifying the attribute has its transitionable (transition object) followed.
However if the state modifying the given property does not contain a state transition object then the attribute is not transitioned.

#### Specifying a transition through the `data()`` method

The overloaded `data()` method of the `Level` object can be used to modify multiple data keys within the level.

  data( changedData, [, stateTransitionObj ] )

Whilst changing data, a state transition object can be specified.
If one is provided, then this given state transition object obtain highest precedence, peaking all of the state transition
objects provided in the corresponding modified states.


##### dataTravel

Level.dataTravelBegin( changedData )
Level.dataTravelContinue( delta )
Level.dataTravelArrive( isArrived )

note: `dataTravelling` attribute is set to true when travelling


Using the `Level.data( changedData, [ ,stateTransitionObject ] )` data can
be changed of any Level. This is data change can cause change in props of
the Level in context, or any other Level constrained by it, directly or indirectly.
This potential data change can have 2 attribute configuration of the Level, these 2 attribute configurations
can result in different observation renderation of the Level:
  (1) The current attribute configuration
  (2) The new attribute configuration (caused by the data change)

With `Level.dataTravelBegin( changedData )`, a controllable transition is initiated.
The position within the transition can be specified by a delta range from 0 to 1 using
the `Level.dataTravelContinue( delta )`, finally the travel can be terminated by calling
the `Level.dataTravelArrive( isArrived )` method, where is `isArrived` contains a boolean
specifying whether the new data modifications should be final (true) or to revert back to the
original data values (false).

Note that while data travelling, any call to `attr()` will return the previous data values.

**Extra attributes associated with data travel**

Two attributes are available to each `Level` which contain information of data travelling:

- *dataTravelling*
  This is boolean specifying `true` if the `Level` is currently data travelling.

- *dataTravellingDelta*
  This is a number specifying the delta of the data travelling, if the `Level` is data travelling.


Example:

Suppose we would want to create a drawer menu.
The drawer menu can be hidden or visible on the screen.
The visibility can be toggled using a button available within the interface.
However, we would also like to include functionality of a user input of a finger swipe, whereby the drawer menu moves along
the point of swipe.

To solve this, we first find which data attribute controls the drawer menu state.
In our application, if it is controlled by the "data.collapsed" attribute, then we can
begin a data travel based on it.


function touchStartHandler () {

  // Initiate the data travel
  this.dataTravelBegin( { "data.collapsed" : !(this).attr("data.collapsed") } )

}


function touchMoveHandler () {



  var isCollapsingMenu = !(this).attr("data.collapsed");
  // Note the below function call is a dummy function
  var delta = findDeltaOfTouchMovement( isCollapsingMenu );

  this.dataTravelContinue( delta );

}

function touchEndHandler () {

  var threshold = 0.8; // this can be tweaked, or even be made based on momentum or any other factor

  var isCollapsingMenu = !(this).attr("data.collapsed");  
  // Note the below function call is a dummy function
  var delta = findDeltaOfTouchMovement( isCollapsingMenu );

  this.dataTravelArrive( delta > threshold );

}






cry about:

  - poor scrolling GPU performance: http://indiegamr.com/ios-html5-performance-issues-with-overflow-scrolling-touch-and-hardware-acceleration/


research:
  - http://jsperf.com/origin-px-vs-percent
