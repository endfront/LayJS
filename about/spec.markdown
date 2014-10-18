<<  Disclaimer: This is the specification which has been not to be read as a tutorial for LSON >>


### LSON

LSON -> Layout Syntax Object Notation


### LSON methods

  LSON.start/run()

  LSON.level()

  LSON.take()

  LSON.rgb()
  LSON.rgba()
  LSON.hsla()
  LSON.hsl()
  LSON.hex()
  LSON.color()
  LSON.transparent()


### LSON.run


    LSON.add([optional: root properties (object)], {
        "x": {

          type: string,
          inherits: string | object,
          data: object | array | string | number,
          props: object,
          when: object,
          many: {
              data: object,
              props: {
                  formation: string,
                  sort: array | string,
                  order: string,
                  ...
              },
              states: {
                  props: object
                  <name>: {
                      onlyif: LSON.Take,
                      install: function,
                      uninstall: function
                  }
              },
          },
          states: {
              <name>: {
                  props: object,
                  when: object,
                  onlyif: LSON.Take,
                  install: function,
                  uninstall: function
              }
          },
          children: object

          }
      })


### type

  **String**
  **constant**
  Type of Part:
    'text'
    'view'
    'interface'
    'link'
    'image'
    'video'
    'canvas'
    'svg'
    'input:single-line'
    'input:multi-line'
    'input:file'


### inherits

  **String** | **Array**
  **constant**



### data

### prop

### many

### state


### states

### children

### when

  LSON.start({

      Box: {
        props: {
          text: "Hello World"
        },

        when: {
          click: [
            function() {
              console.log( "Hello World!" );
            }

          ]
        }
      }
  })




### LSON.Part & LSON.State

To get the LSON.Level returns LSON.Part:

  LSON.level(level)
  LSON.level(<LSON.Part reference>, level)

To get LSON.State object:

  LSON.level(level).state(name)


LSON.Part methods:

  value(property)
  data(name)
  data(name,value)

  stateChange(array, cb)
  stateAdd(array)
  stateRemove(array)
  stateContains(array)






### Constraints Available (Known as "values")

The below values can be directly accessed through
the LSON Part or LSON Many through `.value(<access key>)`
The same access keys are used as the 2nd argument in LSON.Take

  - props
    access: <prop name>

  - data
    access: data.<data key>

  - state
    access: state

  - stateTravelling
    access: stateTravelling

  - stateTravelledDelta
    access stateTravelledDelta

  - naturalWidth
    **number**
    Width of the part occupied by text if its a text element, image if its an image element,
    otherwise if a view then the width occupied by the children parts.
    access: naturalWidth

  - naturalHeight
    **number**
    (read-only) Height of the part occupied by text if its a text element, image if its an image element,
    otherwise if a view then the height occupied by the children parts.
    access: naturalHeight

  - focused
    **boolean**
    access: focused

  - hover
    **boolean**
    access: hover

  - numberOfChildren
    **number**
    Number of the direct descendant parts of the given part.
    access: numberOfChildren

  - numberOfDisplayedChildren
    **number**
    Number of the direct descendant parts of the given part which have display set to true.
    access: numberOfDisplayedChildren



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
  - concat (for string)
  - fn, format
  - i18nFormat
  - lighten, darken (for LSON.Color)
  - (these return booleans) exactly, eq, gt, lt, gte, lte, not, contains
  - (these return booleans) and, or, xor
  - (these return booleans) matches (for regex)


  takes one argument, either:
    - LSON.Take object
    - anything else

  LSON.take(level, property).add(10).divide(LSON.take(level2,property2)).subtract(10).multiply(1.2)
  LSON.take(level, property).min(LSON.take(level2,property2), 20, 30)
  LSON.take(level, property).format(LSON.take(level2, prop2), LSON.take(level3, prop3), "foo:{0}, bar:{1}, baz:{2}" )
  LSON.take(level, property).fn(LSON.take(level2, prop2), LSON.take(level3, prop3), function( arg1, arg2, arg3 ) {
    return something
  })
  LSON.take('/', 'data.lang').i18nFormat(LSON.take(level1, prop1), LSON.take(level2,prop2),
  {
    lang-code: formatable string
    .....
  }

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
LSON.hex(#hexval)
LSON.color(name)  [name: XML recognized color]
LSON.transparent()



LSON.Color functions:

LSON.Color.lighten(mag) (mag:[0,1])
LSON.Color.darken(mag)  (mag:[0,1])

others will come soon

eg of take with color:

  color: LSON.rgb(100, LSON.take('','data.green'),200).lighten(0.1)

  color: LSON.take('header', 'color').lighten(0.5)



### LSON.chain

unimplemented (discussion: need for disucussion)



### LSON inheritance

    LSON.compile({
      "BigBox": {
        inherits: < level string >
      }
    })

or

    LSON.compile({
      "BigBox": {
        inherits: < object reference >
      }
    })


also together using an array (the order of the array IS respected)

  LSON.compile({
    "BigBox": {
      inherits: [ < object reference > | < level string >, ... ]
    }
  })


looks like:

  LSON.compile({
    "BigBox": {
      inherits: [ '../Box', someBoxObject ]
    }
  })




inheritance stacks up
(multiple levels of inheritance through arrays)
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



    LSON.compile({
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


  LSON.compile({
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
                  onlif: {
                    [
                      LSON.take('this', 'data.locked'),
                      LSON.take('../', 'state').contains('collapsed')
                     ]
                  }
                }
              }
            }
        }
      }
  })

### LSON.stateTravel

LSON.stateTravelBegin(state)
LSON.stateTravelContinue(delta)
LSON.stateTravelArrive(is_arrived)

`stateTravelling` value is set to true when travelling


### LSON properties

- origin
  **number**
  Default: 0.5

- originX
  **number**
  Default: 0.5

- originY
  **number**
  Default: 0.5

- originZ
  **number**
  Default: 0


- overflowX
  **string**
  CSS overflow property
  Default: 'visible'

- overflowY
  **string**
  CSS overflow property
  Default: 'visible'


- scrolledX
  **number**
  (read-only for now)


- scrolledY
  **number**
  (read-only for now)




  opacity
  **number**
  Default: 1

- top
  **number**
  Default: 0

- left
  **number**
  Default: 0

- right
  **number**
  Default: null

- bottom
  **number**
  Default: null

- centerX
  **number**
  Default: null

- centerY
  **number**
  Default: null




  width
  **number**
  Width of part (excluding scale)
  Default: LSON.take('naturalWidth')

  height
  **number**
  Height of part (excluding scale)
  Default: LSON.take('naturalHeight')




- cursor
  **string**
  CSS cursor property
  Default: 'default'


- backgroundColor
  **LSON.Color**
  Background color
  Default: LSON.transparent

  // support for multiple background images will come last

  backgroundImage // CSS background / array of CSS background
  backgroundAttachment  // arrayed( boolean -> CSS backgroundAttachment )
  backgroundRepeat // arrayed( boolean -> CSS backgroundRepeat )
  backgroundPosition // array of 2 numbers


  boxShadows   // CSS boxShadow
  eg: [
    [ 'ambient', {inset:true, right:10, bottom:10, blur: 10, color: LSON.rgba(155,55,90,0.6) } ]
  ]

- shiftX
  **number**
  Additional x translation
  Default: 0


- shiftY
  **number**
  Additional y translation
  Default: 0


- scale
  **number**
  Shorthand: scaleX & scaleY
  Default: null


- scaleX
  **number**
  Units to scale X
  Default: 0


- scaleY
  **number**
  Units to scale Y
  Default: 0

- rotateX
  **number**
  In degrees
  Default: 0


- rotateY
  **number**
  In degrees
  Default: 0


- rotateZ
  **number**
  In degrees
  Default: 0




- cornerRadius
  **number**
  In degrees
  Default: null


- cornerRadiusTopLeft
  **number**
  In degrees
  Default: 0

- cornerRadiusTopRight
  **number**
  In degrees
  Default: 0

- cornerRadiusBottomRight
  **number**
  In degrees
  Default: 0

- cornerRadiusBottomLeft
  **number**
  In degrees
  Default: 0



- borderWidth
- borderWidthTop
- borderWidthRight
- borderWidthBottom
- borderWidthLeft

- borderColor
- borderColorTop
- borderColorRight
- borderColorBottom
- borderColorLeft


- borderStyle
- borderStyleTop
- borderStyleRight
- borderStyleBottom
- borderStyleLeft



- text
  **string**

- textSize // number
- textFamily // CSS fontFamily
- textWeight // CSS fontWeight
- textColor // CSS color
- textShadow // CSS textShadow
- textSpacing // CSS letterSpacing
- textVariant // CSS fontVariant
- textStyle // CSS fontStyle
- textDecoration // CSS textDecoration
- textAlign // CSS textAlign
- textWordSpacing // CSS wordSpacing
- textOverflow // CSS textOverflow
- textIndent // number
- textWhitespace

- textPadding
    **number**
    Border box padding
    Default: null

- textPaddingTop
    **number**
    Border box top padding
    Default: 0

- textPaddingRight
    **number**
    Border box right padding
    Default: 0

- textPaddingBottom
    **number**
    Border box bottom padding
    Default: 0

- textPaddingLeft
    **number**
    Border box left padding
    Default: 0

// for type input
- rows
- autocomplete

- placeholder

// for type image

- url

// for type video

- url
  **object**

- autoplay



### LSON when

All:
  - load
  < all possible DOM events on target: 'Element' >

Window:
  (bound on the root: '/')



### Collections


  LSON.start({
      BioData: {
        width: LSON.take('Person'),

        children: {
          'Person': {

            width: 200,
            height:LSON.take('this', 'naturalHeight')

            many: {
              data: {
                n:5
              },
              props: {
                formation:'grid',
                sort: ['name'],
                order: 'ascending',
                id: '_id'
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

  )


id: key which is id (cannot be changed)
first: style of the first element
sort: key (or multiple in order of sorting) to sort (can be changed) or it takes a function
done using (2nd argument a boolean representing whether the sort is in descending order)


rows

  - contains arbitrary data, which is fed into the 'data' key


example:

  {_id:'00423', name:'Eddard Stark', age: 50 },



more can be added by:

  LSON.level('/BioData/Person').more( [{id:'01010', name: 'Robb Stark', age: 32}] )


or committed (facebook react style)

  LSON.level('/BioData/Person').commit( [] );


queries (mongodb style)


  LSON.many("/Lab/Patient").query({"data.age": {$gt:25}, "data.diabetes": {$eq: true} })

  LSON.many("/BuyHosting/Plan").query({ "data.selected":true } })

formation:
  string

formation object examples:

  LSON.formation('onebelow', {
      algorithm: function (options, prev, cur, all, index) {
        if (prev) cur.formation('top', LSON.take(prev, 'bottom'))
      }
  })






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








todo:
  - add support for 'will-change'
  - taker needs reference
  - 'many' n-filters
  - 'many' constraints (LSON.takeMany) selecting the FIRST or LAST
    eg: number of notifications: LSON.takeMany('../Notification', 'state').contains('unread').length()
    ( constraint flow problem: LSON.takeMany('../Notification', 'data.read').eq(false).length()
      solution: order the list of takers to have ones for state notifications last
     )
  - number of visible children
  - statePropChange will be released even later, use data changes instead.
  - figure out data changes syncing with cookie or directly with the server
  - figure out filtering items sending query to the server
  - 'when' for formation comming soon, it should include function handler for insertion of new item into
    the formation alongwith deletion.
  - Allow lson on any node (and allow multiple nodes), instead of only window.
  - cry about safari bug: http://jsbin.com/vufivedefise/1
  - cry about: http://indiegamr.com/ios-html5-performance-issues-with-overflow-scrolling-touch-and-hardware-acceleration/


research:
  - http://jsperf.com/origin-px-vs-percent
