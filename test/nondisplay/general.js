function doNothing1() {

}
function doNothing2() {

}

var externalInherit1 = {
  data: {
    reddish: true
  },
  props: {
    backgroundColor:LAID.rgb(255, 100, 120),
    text: "reddish",
    textColor: LAID.color("brown")
  },
  when: {
    click: [
      function () {}
    ],
    focus: [
      function () {}
    ]
  }
};


LAID.run({
  data: {
    lang: "en"
  },
  children:{
    "Header": {
      props: {
        width: LAID.take("../", "width"),
        height: LAID.take("", "$naturalHeight").add(20),
        backgroundColor: LAID.color("red")
      },
      when: {
        click: [
          doNothing1,
          doNothing2
        ],
      },
      children: {
        "Text": {
          data: {
            content: "Testing",
            notTrue: false
          },
          props: {
            centerX: LAID.take("../", "width").divide(2),
            centerY: LAID.take("../", "height").divide(2),
            text: LAID.take("", "data.content"),
            textColor: LAID.rgb(255, 255, 255)
          }
        }
      }
    },
    "Body": {
      children: {
        "Content": {

            children: {
              "Box": {
                inherit: [externalInherit1],
                data: {
                  box: true
                },
                props: {

                }
              }
            }
        }
      }
    }
  }
});




QUnit.test( "Level: root width", function( assert ) {
  // TODO: check if viewport width/height matches the rootlevel
  //       and also for change
  assert.ok(true, "passed todoo")
  //assert.strictEqual( 1 == 1, "Passed!" );
});

QUnit.test( "LAID.level() [absolute/root]", function( assert ) {
  assert.strictEqual( LAID.level("/") , LAID.$path2level[ "/" ], "Passed!" );
});

QUnit.test( "LAID.level() [absolute/non-root]", function( assert ) {
  assert.strictEqual( LAID.level("/Header/Text") ,
   LAID.$path2level[ "/Header/Text" ], "Passed!" );
});

QUnit.test( "LAID.level() [absolute/relative-child]", function( assert ) {
  assert.strictEqual( LAID.level("Text", LAID.level("/Header") ) ,
   LAID.$path2level[ "/Header/Text" ], "Passed!" );
});

QUnit.test( "LAID.level() [absolute/relative-parent]", function( assert ) {
  assert.strictEqual( LAID.level("../", LAID.level("/Header/Text") ) ,
   LAID.$path2level[ "/Header" ], "Passed!" );
});

QUnit.test( "LAID.level() [absolute/relative-sibling]", function( assert ) {
  assert.strictEqual( LAID.level("../Body", LAID.level("/Header") ) ,
   LAID.$path2level[ "/Body" ], "Passed!" );
});

QUnit.test( "LAID.level() [absolute/relative-ancestor]", function( assert ) {
  assert.strictEqual( LAID.level("../../", LAID.level("/Header/Text") ) ,
   LAID.$path2level[ "/" ], "Passed!" );
});

QUnit.test( "LAID.level() [absolute/relative-cousin]", function( assert ) {
  assert.strictEqual( LAID.level("../../Body", LAID.level("/Header/Text") ) ,
   LAID.$path2level[ "/Body" ], "Passed!" );
});



QUnit.test( "LAID.attr()", function( assert ) {
  assert.strictEqual( LAID.level("/Header/Text").attr("data.content") ,
   "Testing", "Passed!" );
  assert.strictEqual( LAID.level("/Header/Text").attr("text") ,
   "Testing", "Passed!" );
  assert.strictEqual( LAID.level("/Header/Text").attr("data.notTrue") ,
    false, "Passed!" );
});







QUnit.test( "LSON.when", function( assert ) {
  assert.strictEqual( LAID.level("/Header").attr("when.click.1") ,
   doNothing1, "single" );
  assert.strictEqual( LAID.level("/Header").attr("when.click.2") ,
   doNothing2, "multiple" );

});






/*
TODO: Remaining Tests:

  - Inherit
      - one and two inherit (from external)
      - one (one from child, one from neighbour) and two inherit (from within)
      - two inherit (from external and within)


  - LAID.Color

  - LAID.Take

  - LAID.take()

  - LAID.RelPath


  - Normalize
      - lazy prop
      - border decompression (check $$num)
      - multiple type (boxShadows) decompression (check $$max)
      - multiple type (boxShadows) decompression (existing within
        root and state where state number exceeds)(check $$max)
      - multiple type (boxShadows) decompression (existing within
          states and not root)(check $$max)

  - data
    mutability of data object-valued key when inherited
  - when
    - check clicked

  - SLSON (state inherit)
    - check if alphabetical order is maintained
    - check state hashed cache working

  - Take
    check divide, multiply, add.... all others

  - state
    - valid state name
    - check state changes on onlyif invoke (and check install works)
    - check state changes on onlyif uninvoke (and checkk uninstall works)

  - load
    - check load works

  - render
    - check basic render properly like height from node

  - lazy attributes
    - state based
    - readonly based

  - transition
    - position int
    - negative int
    - LAID.Color

  - valid level name
  - For illegal take references to expander props or expander props
   mentioned as takes
    - transition.attr
    - transition
    - when
    - when.eventType
    - inherit
    - props
    - filters
    - border

  - level.addChildren()
  - level.remove()
    - when it is responsibly for natural width/height for parent node
    - when it has child nodes as well (which might be reponsibly for
     other constraints)


*/
