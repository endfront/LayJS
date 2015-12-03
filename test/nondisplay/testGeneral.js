function doNothing1() {

}
function doNothing2() {

}




LAY.run({
  data: {
    lang: "en"
  },
  children:{
    "Header": {
      props: {
        width: LAY.take("../", "width"),
        height: LAY.take("", "$naturalHeight").add(20),
        backgroundColor: LAY.color("red")
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
            centerX: LAY.take("../", "width").divide(2),
            centerY: LAY.take("../", "height").divide(2),
            text: LAY.take("", "data.content"),
            textColor: LAY.rgb(255, 255, 255)
          }
        }
      }
    },
    "Body": {
      children: {
        "Content": {

            children: {
              "Box": {

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

QUnit.test( "LAY.level()", function( assert ) {
  assert.strictEqual( LAY.level("/") , LAY.$path2level[ "/" ],
   "root level" );
  assert.strictEqual( LAY.level("/Header/Text") ,
   LAY.$path2level[ "/Header/Text" ], "non-root level" );
});


QUnit.test( "Level.level()", function( assert ) {
  assert.strictEqual( LAY.level("/Header").level("Text") ,
   LAY.$path2level[ "/Header/Text" ],
    "Child" );
  assert.strictEqual( LAY.level("/Header/Text").level("../") ,
   LAY.$path2level[ "/Header" ], "Parent" );
  assert.strictEqual( LAY.level("/Header").level("../Body") ,
    LAY.$path2level[ "/Body" ], "Sibling" );
  assert.strictEqual( LAY.level("/Header/Text").level("../../") ,
    LAY.$path2level[ "/" ], "Ancestor" );
  assert.strictEqual( LAY.level("/Header/Text").level("../../Body") ,
    LAY.$path2level[ "/Body" ], "Cousin" );

});





QUnit.test( "LAY.attr()", function( assert ) {
  assert.strictEqual( LAY.level("/Header/Text").attr("data.content") ,
   "Testing", "Passed!" );
  assert.strictEqual( LAY.level("/Header/Text").attr("text") ,
   "Testing", "Passed!" );
  assert.strictEqual( LAY.level("/Header/Text").attr("data.notTrue") ,
    false, "Passed!" );
});







QUnit.test( "LSON.when", function( assert ) {
  assert.strictEqual( LAY.level("/Header").attr("when.click.1") ,
   doNothing1, "single" );
  assert.strictEqual( LAY.level("/Header").attr("when.click.2") ,
   doNothing2, "multiple" );

});






/*
TODO: Remaining Tests:

  - Inherit
      - one and two inherit (from external)
      - one (one from child, one from neighbour) and two inherit (from within)
      - two inherit (from external and within)


  - LAY.Color

  - LAY.Take

  - LAY.take()

  - LAY.RelPath


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
    - LAY.Color

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
