

### LAID

LAID involves writing LSON (Layout Syntax Object Notation)


### LAID methods

  LAID.run()
  LAID.level()
  LAID.part()
  LAID.take()
  LAID.filter()

  LAID.rgb()
  LAID.rgba()
  LAID.hsla()
  LAID.hsl()
  LAID.color()


### LAID.run()
  
  The input to `LAID.run()` is an object known as LSON.

    LAID.run( {
      children: {
        "ChildName": {

          $type: string,
          $interface: boolean,
          $inherit [ string | object, ... ],
          $observe: [ string, ... ],
          $load: function,

          data: object | array | string | number,
          props: object,
          when: object,
          transition: transitionObj,

          many: {
              $load: function,
              $id: string / null (constant),

              data: object,
              formation: string,
              sort: [sortDict, ...],
              filter: LAID.take,
              rows: array,
              fargs: obj,

              load: function,

              states: {
                < name >: {
                  formation: string,
                  sort: [sortDict, ...],
                  filter: LAID.take,
                  fargs: obj,
                  install: function
                  uninstall: function
                }
              }

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
       }
      }
    })


### LSON.$type

  Type: `string`.
  On of the below
    "none"
    "text" (auto-detect is on to distinguish between "none" and "text")
    "image"
    "video"
    "audio"
    "canvas"
    "svg"
    ( inputs ...)
    "input:line"
    "input:multiline"
    "input:button"
    "input:select"
    "input:checkbox"
    "input:option"
    "input:optgroup"
    "input:< any other valid input[type] html property i.e file, color, date, etc >" (coming soon: individual support)


### LSON.$inherit

Type: `string` | `Object` | `array of strings and/or Objects`
`string`: Relative path to level to inherit from (eg: "../RoundButton")
`Object`: Direct object which serves as LSON for inheritance.
More about inheritance in inherit section of this document.


### LSON.$interface

  If set to true, the level will not render.
  (Primary usage for such a level exists soley for inheritance)


### data

Type: `Object`
A mapping of keys to values, where meta information specific to the
level can be used for storage.


### props

Type: `Object`

The keys within `props` are predefined

##### List of all possible props

Prioritizing numbers:
There exist some CSS properties which
take either a number (in pixels) or
a string.
An example would be "background-position"
which can be "10px" or "center".
Within LAID, both types are accepted as well,
however to ensure transitionability the input
must be numerical. Therefore it is still
possible to use "center", "auto", "10%", and
other such CSS strings where the input is
not in pixels, however if there is a motive
in changing the value through a state change
alongwith with a transition then numerical
values should be provided.


Defaults:

- display
  `boolean`
  Default: true

- width
  `number`
  Width of part (excluding scale)
  Default: LAID.take('', '$naturalWidth')

- height
  `number`
  Height of part (excluding scale)
  Default: LAID.take('', '$naturalHeight')

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
  Default: 0

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
  Units to scale the X dimension
  Default: 1


- scaleY
  `number`
  Units to scale the Y dimension
  Default: 1

- scaleZ
  `number`
  Units to scale the Z dimension
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
  in pixels
  Default: 0

- perspective
  `number`
  In pixels
  Default: 0

- perspectiveOriginX
  `number`
  in fraction (percent)
  Default: 0.5

- perspectiveOriginY
  `number`
  in fraction (percent)
  Default: 0.5

- backfaceVisibility
  `boolean`
  Default: false

- userSelect
  `boolean`
  Default: false

- opacity
  `number`
  Default: 1


- overflowX
  `string`
  CSS overflow property
  Default: 'hidden'

- overflowY
  `string`
  CSS overflow property
  Default: 'hidden'

- overflow
  `undefined`
  shorthand for `overflowX` and `overflowY`

- scrollX
  `number`
  Default: 0

- scrollY
  `number`
  Default: 0

- scrollElastic
  `boolean`
  CSS `-webkit-overflow-scrolling` with value "touch"
  Default: true

- cursor
  `string`
  CSS cursor property
  Default: 'auto'


- background (no support for multiple backgrounds)
  This is an "object-type" prop.
  {
    color: LAID.Color (Default: transparent),
    image: string (Default: none),
    attachment: string (CSS background-attachment) (Default: "scroll"),
    repeat: string (CSS background-repeat) (Default: true),
    positionX: string (CSS background-position-x) [non-transitionable] / number (in pixels) (Default: 0),
    positionY: string (CSS background-position-y) [non-transitionable] / number (in pixels) (Default: 0),
    sizeX: string (CSS background-size-x) [non-transitionable] / number (in pixels) (Default: "auto"),
    sizeY: string (CSS background-size-y) [non-transitionable] / number (in pixels) (Default: "auto")
   }


- boxShadows
  This is a "multiple-type" and an "object-type" prop.
  [
    {
      inset: boolean (Default: false)
      x: number (in pixels),
      y: number (in pixels),
      blur: number,
      spread: number (Default: 0),
      color: LAID.Color
    }
    ...
  ]

- cornerRadius
  `number`
  This is a "shorthand-type" prop.
  Shorthand for `cornerRadiusTopLeft`, `cornerRadiusTopRight`, `cornerRadiusBottomRight`, `cornerRadiusBottomLeft`
  Default: 0


- border
  This is a "shorthand-type" prop.
  Shorthand for border < Top/Right/Bottom/Left >< Style/Color/Width >
  { top/right/bottom/left/< undefined >: {
    style: string (CSS border-style) (Default: 'solid'),
    color: LAID.Color (Default: transparent),
    width: number (Default: 0)

  } }

  filters
  This is a "multiple-type" and an "object-type" prop.
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
        spread: number (in pixel) [ currently disabled due
        to lack of browser support],
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
  Default: "medium"

- textFamily
  `string`
  CSS font-family
  Default: "inherit"

- textWeight
  `string`
  CSS font-weight
  Default: 'normal'

- textColor
  `LAID.Color`
  Default: "inherit"

- textVariant
  `string`
  CSS font-variant
  Default: 'normal'

- textStyle
  `string`
  CSS font-style
  Default: 'normal'

- textDecoration
  `string`
  CSS text-decoration
  Default: 'none'

- textAlign
  `string`
  CSS text-align
  Default: 'start'


- textLetterSpacing
  `number` / `string`  
  `number`: In pixels.  
  `string`: CSS letter-spacing [non-transitionable]
  Default: 'normal'


- textWordSpacing
  `number` / `string`  
  `number`: In pixels.  
  `string`: CSS word-spacing [non-transitionable]
  Default: 'normal'

- textLineHeight
  `number` / `string`
  `number`: In em.  
  `string`: CSS line-height [non-transitionable]
  Default: 1

- textOverflow
  `string`
  CSS text-overflow
  Default: 'clip'

- textIndent
  `number`
  Default: 0

- textWhitespace
  `string`
  CSS white-space
  Default: 'normal'

- textSmoothing
  `string`
  CSS font-smoothing
  Default: "subpixel-antialiased"

- textRendering
  `string`
  CSS text-rendering
  Default: "auto"

- textPadding
  `number`
  This is a "shorthand-type" prop.
  Border box padding.
  Shorthand for `textPaddingTop`, `textPaddingRight`, `textPaddingBottom` and `textPaddingLeft`
  Default: 0

- textShadows
  This is a "multiple-type" and an "object-type" prop.
  [
    {
      x: number ,
      y: number ,
      blur: number ,
      color: LAID.Color
    }
    ...
  ]
  
- inputLabel
  `string`
  Default: ""

- input
  `string`
  Default: ""

- inputPlaceholder
  `string`
  Default: ""

- inputAutocomplete
  `boolean`
  Default: true

- inputAutocorrect
  `boolean`
  Default: true

- inputDisabled
  `boolean`
  Default: false


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
  This is a "multiple-type" and an "object-type" prop.
  [
    {
      type: string ( html5 < source > type ),
       src: string ( html5 < source > src )
    },
    ...
  ]

- videoTracks / audioTracks
  This is a "multiple-type" and an "object-type" prop.
  [
    {
      default: boolean (Default: false),
      kind: string ( html5 < track > kind ) (Default: ""),
      label: string ( html5 < track > label ) (Default: ""),
      src: string ( html5 < track > src ) (Default: ""),
      srclang: string ( html5 < track > srclang ) (Default: "")
    },
    ...
  ]


- videoAutoplay
  `boolean`
  Default: false


- videoControls / audioControls
  `boolean`
  Default: true


- videoCrossorigin
  `string`
  html5 < video > crossorigin
  Default: "anonymous"


- videoLoop / audioLoop
  `boolean`
  Default: false


- videoMuted / audioMuted
  `boolean`
  Default: false



- videoPreload / audioPreload
  `string`
  html5 < video >/< audio > preload
  Default: 'auto'


- videoPoster
  `string` / `null`
  Default: null


- audioVolume
  `number`
  Default: 0.7


### Attributes

  The below values can be directly accessed through
  the LAID Level through `.attr(< access key >)`
  The same access keys are used as the 2nd argument in LAID.Take

  - <prop>

  - data.<data>

  - when.<event>.<num>

  - transition.<attr>.<duration/delay/done/type>

  - transition.<attr>.args.<arg>

  - load

  - formation

  - fargs.<formation>.<key>

  - sort.<num>.key

  - sort.<num>.ascending

  - filter

  - <state>.<prop>

  - <state>.when.<event><num>

  - <state>.transition.<attr><duration/delay/done/type>

  - <state>.transition.<attr>.args.<arg>

  - <state>.onlyif

  - <state>.install

  - <state>.uninstall


  - read-only properties (prefix: $)

    - $type
      This can only be set once using a non-take value with the LSON.

    - $inherit
      This can only be set once using a non-take value with the LSON.

    - $interface
      This can only be set once using a non-take value with the LSON.

    - $observe
      This can only be set once using a non-take value with the LSON.

    - $dataTravelling (`boolean`)

    - $dataTravelDelta (`number`)

    - $dataTravelLevel ('LAID.Level')

    - $naturalWidth (`number`)
      Width of the part occupied by text if its a text element, image if its an image element, otherwise if a view then the width occupied by the children parts.

    - $naturalHeight (`number`)
      Height of the part occupied by text if its a text element, image if its an image element, otherwise if a view then the height occupied by the children parts.

    - $absoluteX (`number`)
      Position in pixels of the left of the element relative to the root level ( irrespective of the amount scrolled horizontally ).

    - $absoluteY (`number`)
      Position in pixels of the top of the element relative to the root level ( irrespective of the amount scrolled vertically ).

    - $all
      All the Levels created by the many-level

    - $id
      The name of the unique key which is reponsible for id for each row in `rows` for many-level

    - $i
      Index of a (`Many`) derived `Level` with respect to other `Level`s derived in the `Many` Level, as decided by the `sort` and `ascending` keys.
    
    - $f
      Index of a (`Many`) derived `Level` with respect to other `Level`s derived in the `Many` Level, as decided by the  `filter`, `sort` and `ascending` keys.

    - $focused (`boolean`)

    - $clicked (`boolean`)

    - $hovered (`boolean`)

    - $scrolledX (`number`)

    - $scrolledY (`number`)

    - $cursorX (`number`)

    - $cursorY ('number')

    - $input (`string`)

    - $inputChecked (`boolean`)


### LSON.$observe

  All read-only attributes except for:
    - $numberOfChildren
    - $naturalWidth
    - $naturalHeight
    - $dataTravelling
    - $dataTravelDelta
    - $dataTravelLevel

  such as "$hovered", "$focused" and the others require 2 or more event listeners bound to the respective DOM element. These event listeners are expensive to inculcate within all Level Parts by default. Thus only if there exists a reference to one of these read-only attributes within the LSON as a "take()", the event listeners will be activated. Albeit the issue lies when/if a reference is made to one of these read-onlys using "Level.attr()", since lexical parsing of internal functions is out of the question there is no viable way for LAID to be aware and switch on the event listeners for the corresponding read-only.
  This is the purpose behind `$observe`, `$observe` takes in an array of strings, where strings are references made to such read-onlys. Thus if a reference is made within `$observe` LAID will switch on the event listeners for the
  read-only.

### LSON.many

Type: `Object`


### LSON.states

Object containing states.
More about states in the states section


### LSON.children

Object containing children levels in the form of LSON.


### LSON.when

contains events as keys, and values as a callback function or
arrays of callback functions (order respected)
The context of the handler function will be the corresponding `Level`.

example with a single callback function specified:

    LAID.start({
        Box: {
          props: {
            text: "Hello World"
          },
          when: {
            click: function() {
                console.log( "Hello World!" );
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


### LSON.load

Functions called upon loading of level, with the context of the level.

### LAID.Level

To get the LAID.Level:

  LAID.level(level) // fetches level
  LAID.level(< LAID.Part reference >, level) // fetches level wrt reference

LAID.Level methods:

  attr( attr ) //gets attr value
  data( changedData ) //changes data value
  parent()
  path()
  manyLevel()
  rowsMore()
  rowsCommit()
  rowDelete()
  queryAll()
  queryFiltered()
  addChildren()
  remove()


### LAID.take & LAID.Take

creates LAID.Take object:

  LAID.take(level, property)

or

  LAID.take(property) //this will refer to self


LAID.Take methods

  - add,subtract,divide,multiply
  - remainder
  - half, double (unary)
  - min, max
  - ceil, floor, abs, sin, cos, tan
  - log, pow
  - negative (unary)
  - index, length (for array)
  - key (for dict)
  - concat (for string)
  - fn (context `this` is the `Level`)
  - format, i18nFormat
  - (these return booleans) eq (===), neq (!==), gt, lt, gte, lte, not, contains
  - (these return booleans) and, or, xor
  - (these return booleans) match, test (for regex)
  - (LAID.Color) colorLighten, colorDarken, colorSaturate, colorDesaturate, colorContrast, colorAlpha, colorRed, colorGreen, colorBlue, colorInvert, colorHue, colorLightness, colorSaturation, colorEquals
  - (many) filterEq, filterNeq, filterGt, filterLt, filterLte, filterGte, filterRegex,
  filterContains, filterWithin, filterFn,
  foldMax, foldMin, foldSum, foldFn,
   queryFetch, length


  takes one argument, either:
    - LAID.Take object
    - anything else

  LAID.take(levelPath, property).add(10).divide(LAID.take(levelPath2,attr2)).subtract(10).multiply(1.2)
  LAID.take(level, attr).min(LAID.take(levelPath2,attr2), 20, 30)
  LAID.take("foo:%s, bar:%s, baz:%s").format(LAID.take(levelPath1, attr1), LAID.take(levelPath2, attr2), LAID.take(levelPath3, attr3) )
  LAID.take(function).fn(LAID.take(levelPath1, attr1), LAID.take(levelPath2, attr2), LAID.take(levelPath3, attr3), function( arg1, arg2, arg3 ) {
    return something
  })
  LAID.take('/', 'data.lang').i18nFormat(
  {
    lang-code: formattable string
    .....
  },
  LAID.take(level1, attr1), LAID.take(level2,attr2)
  )

  LAID.take(manyLevelPath, "many").filterGt("age", 10).filterLt(
  "age", LAID.take(level, attr)).length()



)


### LAID.Color (LAID.rgb, LAID.rgba, LAID.hsl, LAID.hsla, LAID.color)

LAID.rgb(r,g,b)   (r,g,b:[0,255])
LAID.rgba(r,g,b,a) (r,g,b:[0,255], a:[0,1])
LAID.hsl(h,s,l)   (h:[0,240], s,l: [0,1])
LAID.hsla(h,s,l,a) (h:[0,240], s,l,a: [0,1])
LAID.color(name)  [name: XML recognized color]
LAID.transparent()



eg of take with color:

  color: LAID.take('header', 'color').colorDarken(0.5)
  color: LAID.rgb(100, LAID.take('','data.green'),200).colorLighten(0.1)



### Order of Transformation

Scale -> Position -> Skew -> Rotate


### Inheritance

    LAID.run({
      "BigBox": {
        $inherit < level string >
      }
    })

or

    LAID.run({
      "BigBox": {
        $inherit < object reference >
      }
    })


also together using an array (the order of the array is respected from left to right)

  LAID.run({
    "BigBox": {
      $inherit [ < object reference > | < level string >, ... ]
    }
  })


looks like:

  LAID.run({
    "BigBox": {
      $inherit [ '../Box', someBoxObject ]
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
        $inherit [ box ],
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
            width: LAID.take('', 'textWidth'),
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
- the scope of `states[state]` and `many` are inherited recursively iwth the same inheritance rulest
- the `transiton` key inherits to the lowest level
- all other props are overwritten at single level, and data values which are objects are cloned before copying over.
- the 'many.sort' key is overwritten

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
        $inherit ["Box"],
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
    '/'

  - Direct
    '/Rankings/Winners/Stats'

  - Relative
    'Winners/Stats'
    '../'

  - Current
    ''

  - Special
      - '' ('.')
      - '' ('.')
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
                    left: LAID.take('', 'width').negative()
                  },
                  onlyif: LAID.take('', 'data.locked').and(LAID.take('../', 'state.collapsed'))
                }
              }
            }
        }
      }
  })



States are unordered.
The inheritance mechanism governing states matches that mentioned for the `$inherit` key.
onlyif is the condition for which a state needs to be activated.
Takes across states and root lson takes place by prefixing "< state name >." to the corresponding "props", "when", and "transition" keys:

LAID.run({
    Box: {
      props: {
        backgroundColor: LAID.rgba(245, 100, 145, 0.5)
      },
      states: {
        hovered: {
          onlyif: LAID.take("", "$hovered"),
          props: {
            backgroundColor: LAID.take("", "root.backgroundColor").colorDarken(0.8)
          }
        }
      }
    }

})



### Many

  Related methods:
    - rowsMore()
    - rowsCommit()


  LAID.run({
      "BioData": {
        children: {
          "Person": {
            data: {
              onlyStarks: false
            },
            many: {
              
              formation:'onebelow',
              sort: ['name'],
              ascending: true, //default
              fargs: {
                onebelow: { gap: 2 }
              },
              
              $id: "_id",

              rows: [
                {_id:'00423', name:'Eddard Stark',
                  family:'Stark', age: 50},
                {_id:'08383', name:'Tyrion Lannister',
                  family:'Lannister', age: 40},
                {_id:'07323', name:'Sansa Stark',
                  family:'Stark', age: 42},  
                {_id:'01919', name:'Joffrey Baratheon',
                  family:'Baratheon', age: 16},
                {_id:'01030', name:'Jamie Lannister',
                  family:'Lannister', age: 32},
              ],
              states: {
                "starks": {
                  onlyif: LAID.take("", "data.onlyStarks"),
                  filter: LAID.take("", "$all").filterEq("family", "Stark")
                }
              }
            }
          }
      }
    }
  })




$id: key which is id (cannot be changed)
sort: key (or multiple in order of sorting) to sort (can be changed) or it takes a function
ascending: the order of the sort, true by default. False for descending.
filter: the levels which pass the filter will be displayed,
the others will be hidden. (note: levels derived of many
will have their "display" automatically handled through
this filter, and thus manually using the "display" prop within a
many derived level is prohibited) 


rows

  Contains arbitrary data, which is fed into the 'data' key.
  This result of data changes are bound to this array


example:

  {_id:'00423', name:'Eddard Stark', age: 50 },

more can be added by:

  LAID.level('/BioData/Person').rowsMore( [{_id:'01010', name: 'Robb Stark', age: 32}] )


or committed (facebook react style)

  LAID.level('/BioData/Person').rowsCommit( [
    {_id:'00423', name:'Eddard Stark', age: 50},
    {_id:'08383', name:'Tyrion Lannister', age: 40},
    {_id:'01919', name:'Joffrey Baratheon', age: 16},
    {_id:'01010', name: 'Robb Stark', age: 32}
  ] );


formation:
  `String`

All built-in formations:
  - "onebelow"
  - "totheright"
  - "grid" [coming soon]


Formation Arguments:

Arguments for formation are to be specified in the
LSON key "many.fargs.< formation name >"
Below are formation arguments for corresponding formations:

  - "onebelow"
    - gap: specifies the distance in pixels to be kept vertically between consecutive Levels
  - "totheight"
    - gap: specifies the distance in pixels to be kept horizontally between consecutive Levels


Formation Creation:


Formations can be added on the go, using `LAID.formation()`,
with a unique formation name and formation function to it.
An example of the "onebelow" formation:

    // TODO: fill


### State Transition Object

Transitions for numeric prop-typed attributes.

  {

    all: { duration: 100, type: "spring", args: { tension: 100 } },
    left: { duration: 200},
    top: { delay: 500 },
    opacity: { duration:2000, done: function(){ console.log("opaque") }  }

  }

Each key in the state transition object except for "all" directly refer to a prop-typed attribute.
The key refers to an object with 5 possible keys:
    (i) type ( type of transition )
    (ii) duration ( of the transition )
    (iii) delay ( till the start of the transition )
    (iv) done ( function handler executed at the end of the transition )
    (v) args ( additional args )

The type can one of the 3:
  "linear"
  "cubic-bezier"
  "spring"

The corresponding arguments provided within args are:
  - "linear", "ease", "ease-in", "ease-out", "ease-in-out": no arguments
  - "cubic-bezier"
    - a: float between 0 and 1
    - b: float between 0 and 1
    - c: float between 0 and 1
    - d: float between 0 and 1
  - "spring"
    - tension
    - friction
    - velocity (default: 0)
    - threshold (default: 0.001)


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

Level.dataTravelBegin( dataKey, changedData )
Level.dataTravelContinue( delta )
Level.dataTravelArrive( isArrived )

note: `dataTravelling` attribute is set to true when travelling


Using the `Level.data( dataKey, changedData )` data can
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

Three (read-only) attributes are available to the root `Level` which contain information of data travelling:

- $dataTravelling
  This is a boolean specifying `true` if there is data travelling.

- $dataTravelDelta
  This is a float (number) specifying the delta of the data travelling.

- $dataTravelLevel
  This is the Level where the data travel was initiated from (using dataTravelBegin)


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
