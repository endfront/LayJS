< <  Warning: This is the specification which is not to be read as a tutorial for LAID > >


### LAID

LAID involves writing LSON (Layout Syntax Object Notation)


### LAID methods

  LAID.run()
  LAID.level()
  LAID.many()
  LAID.part()
  LAID.take()
  LAID.takeMany()

  LAID.rgb()
  LAID.rgba()
  LAID.hsla()
  LAID.hsl()
  LAID.color()


### LAID.run


    LAID.run([optional: root properties (object)], {
        "Name": {

          type: string,
          interface: boolean,
          inherits: [ string | object, ... ],
          data: object | array | string | number,
          props: object,
          when: object,
          transition: transitionObj,
          load: function,
          observe: [ string, ... ],
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
              load: function,
              states: {
                  props: object
                  < name >: {
                      props: object,
                      onlyif: LAID.Take,
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
                  onlyif: LAID.Take,
                  transition: transitionObj,
                  install: function,
                  uninstall: function
              }
          },
          children: LSON

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
    "input:checkbox"
    "input:option"
    "input:optgroup"
    "input:< any other valid input[type] html property i.e file, color, date, etc >" (coming soon: individual support)



### interface

  If set to true, the level will not render.
  Primary usage for such a level exists during inheritance.

### inherits

Type: `String` | `Array of Strings`
Constant: *Yes*


### data


Type: `Object`



### props

Type: `Object`

The keys within `props` are predefined

##### List of props

Psuedo-Defaults:
  Leaving aside the few essential props: "left", "top", "width", and "height";
  every other prop which comes with a default comes with a "Psuedo-Default",
  which is the default value for the prop just as it is for the essential
  ( i.e "left", "top", "width", and "height" ), albeit the difference is in
  the attribute access of the prop. A prop without an LSON value which falls
  back on a psuedo-default will when accessed by attribute will return
  undefined. The reason behind this is performance optimization, as there
  exist a large number of props which need basic defaults, however will
  unlikely be accessed as an attribute.
  Note: wherever "Default" or "Psuedo-Default" is not mentioned, specifying
  the the prop is a must.

- display
  `boolean`
  Psuedo-Default: 0

- width
  `number`
  Width of part (excluding scale)
  Default: LAID.take('this', '$naturalWidth')

- height
  `number`
  Height of part (excluding scale)
  Default: LAID.take('this', '$naturalHeight')

- top
  `number`
  Default: 0

- left
  `number`
  Default: 0

- right
  `number`

- bottom
  `number`

- centerX
  `number`

- centerY
  `number`

- z
  `number`
  In pixels
  Psuedo-Default: 0

- shiftX
  `number`
  Additional x translation
  Psuedo-Default: 0

- shiftY
  `number`
  Additional y translation
  Psuedo-Default: 0

- shiftZ
  `number`
  Additional z translation
  Psuedo-Default: 0


- scaleX
  `number`
  Units to scale the X dimension
  Psuedo-Default: 1


- scaleY
  `number`
  Units to scale the Y dimension
  Psuedo-Default: 1

- scaleZ
  `number`
  Units to scale the Z dimension
  Psuedo-Default: 1


- rotateX
  `number`
  In degrees
  Psuedo-Default: 0


- rotateY
  `number`
  In degrees
  Psuedo-Default: 0


- rotateZ
  `number`
  In degrees
  Psuedo-Default: 0


- skewX
  `number`
  In degrees
  Psuedo-Default: 0

- skewY
  `number`
  In degress
  Psuedo-Default: 0

- originX
  `number`
  in fraction (percent)
  Psuedo-Default: 0.5

- originY
  `number`
  in fraction (percent)
  Psuedo-Default: 0.5

- originZ
  `number`
  in fraction (percent)
  Psuedo-Default: 0

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

- backfaceVisibility
  `boolean`
  Psuedo-Default: false


- opacity
  `number`
  Psuedo-Default: 1


- overflowX
  `string`
  CSS overflow property
  Psuedo-Default: 'hidden'

- overflowY
  `string`
  CSS overflow property
  Psuedo-Default: 'hidden'


- scrollX
  `number`
  Psuedo-Default: 0

- scrollY
  `number`
  Psuedo-Default: 0

- scrollElastic
  `boolean`
  CSS `-webkit-overflow-scrolling` with value "touch"
  Psuedo-Default: true

- cursor
  `string`
  CSS cursor property
  Psuedo-Default: 'auto'


- background (no support for multiple backgrounds)
  {
    color: LAID.Color (Psuedo-default: transparent),
    image: string (Psuedo-Default: none),
    attachment: string (CSS background-attachment) (Psuedo-Default: "scroll"),
    repeat: string (CSS background-repeat) (Psuedo-Default: false),
    positionX: number (Psuedo-Default: 0),
    positionY: number (Psuedo-Default: 0),
    sizeX: number (Psuedo-Default: "auto" (can be invoked using `undefined` value), note: no transition between the 2),
    sizeY: number (Psuedo-Default: "auto" (can be invoked using `undefined` value), note: no transition between the 2)
   }


- boxShadows
  *multiple type prop*
  [
    {
      inset: boolean (Psuedo-Default: false)
      x: number (in pixels),
      y: number (in pixels),
      blur: number,
      spread: number (Psuedo-Default: 0),
      color: LAID.Color
    }
    ...
  ]





- cornerRadius
  `number`
  Shorthand for `cornerRadiusTopLeft`, `cornerRadiusTopRight`, `cornerRadiusBottomRight`, `cornerRadiusBottomLeft`
  Psuedo-Default: 0


- border
  Shorthand for border < Top/Right/Bottom/Left >< Style/Color/Width >
  { top/right/bottom/left/< undefined >: {
    style: string (CSS border-style) (Psuedo-Default: 'solid'),
    color: LAID.Color (Psuedo-Default: transparent),
    width: number (Psuedo-Default: 0)

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
        x: number (in pixels),
        y: number (in pixels),
        blur: number (in pixels),
        color: LAID.Color
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
  `LAID.Color`
  Psuedo-Default: "black"


- textShadows
 *multiple type prop*
  [
    {
      x: number ,
      y: number ,
      blur: number ,
      color: LAID.Color
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
  Psuedo-Default: 'start'


- textLetterSpacing
  `number` / `undefined`
  In pixels. undefined for initial (native) letter spacing.
  Psuedo-Default: "normal" (can be invoked using `undefined` value, note: no transition between the 2)


- textWordSpacing
  `number` / `undefined`
  In pixels. undefined for initial (native) word spacing.
  Psuedo-Default: "normal" (can be invoked using `undefined` value, note: no transition between the 2)


- textOverflow
  `string`
  CSS text-overflow
  Psuedo-Default: 'clip'


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
  Psuedo-Default: ""

- inputRows
  `number`
  Rows for textarea
  Psuedo-Default: 2

- input
  `string`
  Psuedo-Default: ""

- inputPlaceholder
  `string`
  Psuedo-Default: ""

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


- linkRel
  `string`
  HTML a[rel]

- linkDownload
  `boolean`

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
      default: boolean (psuedo-default: false),
      kind: string ( html5 < track > kind ) (psuedo-default: ""),
      label: string ( html5 < track > label ) (psuedo-default: ""),
      src: string ( html5 < track > src ) (psuedo-default: ""),
      srclang: string ( html5 < track > srclang ) (psuedo-default: "")
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


### Attributes

  The below values can be directly accessed through
  the LAID Level through `.attr(< access key >)`
  The same access keys are used as the 2nd argument in LAID.Take

  - <prop>

  - data.<data>

  - when.<event><num>

  - transition.<attr>.<duration/delay/done/type>

  - transition.<attr>.args.<arg>

  - state.<state>
  returns true if state is active

  - <state>.<prop>

  - <state>.when<event><num>

  - <state>.transition.<attr><duration/delay/done/type>

  - <state>.transition.<attr>.args.<arg>

  - <state>.onlyif

  - <state>.install

  - <state>.uninstall


  - read-only properties (prefix: $)
    - $dataTravelling (`boolean`)

    - $dataTravelledDelta (`number`)

    - $naturalWidth (`number`)
    Width of the part occupied by text if its a text element, image if its an image element,
    otherwise if a view then the width occupied by the children parts.

    - $naturalHeight (`number`)
    Height of the part occupied by text if its a text element, image if its an image element,
    otherwise if a view then the height occupied by the children parts.

    - $absoluteLeft (`number`)
    Position in pixels of the left of the element relative to the root level ( irrespective of the amount scrolled horizontally ).

    - $absoluteTop (`number`)
    Position in pixels of the top of the element relative to the root level ( irrespective of the amount scrolled vertically ).


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

    - $input (`string`)

    - $inputChecked (`boolean`)

    /*- $inputSelected (`boolean`)*/


### LAID observe

  All read-only attributes except for:
    - $numberOfChildren
    - $naturalWidth
    - $naturalHeight
    - $dataTravelling
    - $dataTravelledDelta

  such as "$hovered", "$focused", "$input", and
  the others require 2 or more event listeners bound to the respective
  DOM element. These event listeners are expensive to inculcate within
  all Level Parts by default. Thus only if there exists a reference
  to one of these read-only attributes within the LSON as a "take",
  the event listeners will be activated. Albeit the issue lies when/if a
  reference is made to one of these read-onlys using "Level.attr()",
  since lexical parsing of internal functions is out of the question there
  is no viable way for LAID to be aware and switch on the event listeners for
  the corresponding read-only.
  This is the purpose behind `observe`, `observe` takes in an array of strings,
  where strings are references made to such read-onlys. Thus if a reference is
  made within `observe` LAID will switch on the event listeners for the
  read-only.

### LAID many

Type: `Object`



### LAID states

object containing states

### LAID children

children levels


### LAID when

contains events as keys, and values as a callback function or
arrays of callback functions (order respected)
The context of the handler function will be the corresponding Level.

example with a single callback function specified:

    LAID.start({
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

    LAID.start({
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


### LAID load

Functions called upon loading of level.

### LAID.Level

To get the LAID.Level:

  LAID.level(level) // fetches level
  LAID.level(< LAID.Part reference >, level) // fetches level wrt reference

LAID.Level methods:

  attr( attr ) //gets attr value
  data( changedData ) //changes data value








### LAID.take & LAID.Take

creates LAID.Take object:

  LAID.take(level, property)

or

  LAID.take(property) //this will refer to self


LAID.Take methods

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
  - (LAID.Color) colorLighten, colorDarken, colorSaturate, colorDesaturate, colorContrast, colorGrayscale, colorAlpha, colorRed, colorGreen, colorBlue, colorInvert, colorHue, colorLightness, colorSaturation
  - (these return booleans) exactly, eq, gt, lt, gte, lte, not, contains
  - (these return booleans) and, or, xor
  - (these return booleans) match (for regex)


  takes one argument, either:
    - LAID.Take object
    - anything else

  LAID.take(level, property).add(10).divide(LAID.take(level2,property2)).subtract(10).multiply(1.2)
  LAID.take(level, property).min(LAID.take(level2,property2), 20, 30)
  LAID.take("foo:%s, bar:%s, baz:%s").format(LAID.take(level1, prop1), LAID.take(level2, prop2), LAID.take(level3, prop3) )
  LAID.take(function).fn(LAID.take(level1, prop1), LAID.take(level2, prop2), LAID.take(level3, prop3), function( arg1, arg2, arg3 ) {
    return something
  })
  LAID.take('/', 'data.lang').i18nFormat(
  {
    lang-code: formattable string
    .....
  },
  LAID.take(level1, prop1), LAID.take(level2,prop2)
  )


LAID.takeMany

  For queries:

  LAID.takeMany( level, queryObject )

  available methods:
  - length()
  - one() (yields a take object)


  LAID.takeMany("/Lab/Patient, {"data.age": {$gt:25}, "data.diabetes": {$eq: true} }).length()

  LAID.takeMany("/BuyHosting/Plan", { "data.selected":true } }).one("data.price")


### LAID.Color (LAID.rgb, LAID.rgba, LAID.hsl, LAID.hsla, LAID.color)

LAID.rgb(r,g,b)   (r,g,b:[0,255])
LAID.rgba(r,g,b,a) (r,g,b:[0,255], a:[0,1])
LAID.hsl(h,s,l)   (h:[0,240], s,l: [0,1])
LAID.hsla(h,s,l,a) (h:[0,240], s,l,a: [0,1])
LAID.color(name)  [name: XML recognized color]
LAID.transparent()



eg of take with color:

  color: LAID.take('header', 'color').colorDarken(0.5)
  color: LAID.rgb(100, LAID.take('this','data.green'),200).colorLighten(0.1)



### Order of Transformation

Scale -> Position -> Skew -> Rotate


### LAID inherits

    LAID.run({
      "BigBox": {
        inherits: < level string >
      }
    })

or

    LAID.run({
      "BigBox": {
        inherits: < object reference >
      }
    })


also together using an array (the order of the array is respected from left to right)

  LAID.run({
    "BigBox": {
      inherits: [ < object reference > | < level string >, ... ]
    }
  })


looks like:

  LAID.run({
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
              width: LAID.take('parent', 'width').half(),
              height: LAID.take('parent', 'height').half()
            }
          }
      }
    }



    LAID.run({
      "BigBox": {
        inherits: [ box ],
        props: {
          width: 300,
          height: 300
        },
        children: {
        LeftSide: {
          props: {
            backgroundColor: LAID.color('blue')
          }
        },
        RightSide: {
          props: {
            left: LAID.take('../LeftSide', 'right'),
            width: LAID.take('this', 'textWidth'),
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
              width: LAID.take('parent', 'width').half(),
              height: LAID.take('parent', 'height').half(),
              backgroundColor: LAID.color('red')
            }
          }
          RightSide: {
            props: {
              left: LAID.take('prev-sibling', 'right'),
              text: 'nothing here'
            }
          }
        }
      }
    }


##### LAID inheritance rules

- events within 'when' key stacks up as an array
- the scope of `states[state]` and `many` are inherited recursively iwth the same inheritance rules
- the `many.rows` key is overwritten at the same level with clones made of each row (array) element
- the `transiiton` key inherits to the lowest level
- all other props are overwritten at single level, and data values which are objects are cloned before copying over.


example of `when` stacking up:

  LAID.run({
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



### LAID references

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



### LAID states

  Reserved state name: "root"

  LAID.run({
    LeaderBoard: {
          children: {
            Nav: {
              props: {
                width:200,
                left: 0,
                backgroundColor: LAID.color('black'),
                textColor:LAID.color('white')
              },
              state: ['closed'],
              states: {
                closed: {
                  props: {
                    left: LAID.take('this', 'width').negative()
                  },
                  onlyif: LAID.take('this', 'data.locked').and(LAID.take('../', 'state.collapsed'))
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

LAID.run({
    Box: {
      props: {
        backgroundColor: LAID.rgba(245, 100, 145, 0.5)
      },
      states: {
        hovered: {
          onlyif: LAID.take("this", "$hovered"),
          props: {
            backgroundColor: LAID.take("this", "root.backgroundColor").colorDarken(0.8)
          }
        }
      }
    }

})



### Many


  LAID.start({
      "BioData": {
        width: LAID.take('Person'),
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

  LAID.many('/BioData/Person').more( [{id:'01010', name: 'Robb Stark', age: 32}] )


or committed (facebook react style)

  LAID.many('/BioData/Person').commit( [
    {_id:'00423', name:'Eddard Stark', age: 50},
    {_id:'08383', name:'Tyrion Lannister', age: 40},
    {_id:'01919', name:'Joffrey Baratheon', age: 16},
    {id:'01010', name: 'Robb Stark', age: 32}
  ] );


queries (mongodb style)

  LAID.many("/Lab/Patient").query({"data.age": {$gt:25}, "data.diabetes": {$eq: true} })
  LAID.many("/BuyHosting/Plan").query({ "data.selected":true } })

formation:
  `String`

formation object examples:

(1) "onebelow" formation

  LAID.formation('onebelow', {
      algorithm: function (options, prev, cur, all, index) {
        if (prev) cur.formation('top', LAID.take(prev, 'bottom'))
      }
  })




(2) "grid" formation

for grid (note that the width and height cannot be used effectively for a grid)

  LAID.formation('grid', {
      algorithm: function (options, prev, cur, all, index) {
        if (prev) {
          var row = Math.floor( index / 5 );
          var column = index % 5;
          cur.formation('left', LAID.take('this', 'width').multiply(column));
          cur.formation('top', LAID.take('this', 'height').multiply(row));
        }
      }
  })








### State Transition Object

Transitions for numeric prop-typed attributes.

  {

    all: { duration: 100, transition: "linear", args: { tension: 100 } },
    positional: { transition: "spring" },
    left: { duration: 200},
    top: { delay: 500 },
    opacity: { duration:2000, done: function(){ console.log("opaque") }  }

  }

Each key in the state transition object except for "positional" directly refer to a prop-typed attribute.
The key refers to an object with 5 possible keys:
    (i) type ( type of transition )
    (ii) duration ( of the transition )
    (iii) delay ( till the start of the transition )
    (iv) done ( function handler executed at the end of the transition )
    (v) args ( additional args )

The key "positional" refers to the following position related prop-typed attributes:
  - left
  - centerX
  - right
  - top
  - centerY
  - bottom
  - z
  - shiftX
  - shiftY
  - scaleX
  - scaleY
  - scaleZ
  - rotateX
  - rotateY
  - rotateZ
  - skewX
  - skewY

Using "positional" alongwith "opacity" and "filters<num>..." for transitions is highly recommended for
better performance via bypassing heavy GPU uploads.



An attribute can be of 2 types:

  (1) Transitionable
    Any numeric attribute can be transitioned.
  (2) Non-transitionable
    Non numeric attributes such as textFamily (font family) are non transitionable.
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
