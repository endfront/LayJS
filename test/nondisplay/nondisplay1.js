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
            data: {

              zero: LAID.take( 0 ),
              zeroCopy: LAID.take("", "data.zero"),
              five: 5,
              three: 3,
              threePointFive: 3.5,
              sampleList: [ 2, 2.5, 3, 3.5 ],

              fiveAddTwo: LAID.take("", "data.five").add(2),
              fiveAddTwoPointFive: LAID.take("", "data.five").add(2.5),
              fiveAddTakeThree: LAID.take("", "data.five").add(
                LAID.take("", "data.three")),
              fiveAddTakeThreePointFive: LAID.take("", "data.five").add(
                LAID.take("", "data.threePointFive")),


              fiveSubtractTwo: LAID.take("", "data.five").subtract(2),
              fiveSubtractTwoPointFive: LAID.take("", "data.five").subtract(2.5),
              fiveSubtractTakeThree: LAID.take("", "data.five").subtract(
                LAID.take("", "data.three")),
              fiveSubtractTakeThreePointFive: LAID.take("", "data.five").subtract(
                LAID.take("", "data.threePointFive")),

              fiveMultiplyTwo: LAID.take("", "data.five").multiply(2),
              fiveMultiplyTwoPointFive: LAID.take("", "data.five").multiply(2.5),
              fiveMultiplyTakeThree: LAID.take("", "data.five").multiply(
                LAID.take("", "data.three")),
              fiveMultiplyTakeThreePointFive: LAID.take("", "data.five").multiply(
                LAID.take("", "data.threePointFive")),

              fiveDivideTwo: LAID.take("", "data.five").divide(2),
              fiveDivideTwoPointFive: LAID.take("", "data.five").divide(2.5),
              fiveDivideTakeThree: LAID.take("", "data.five").divide(
                LAID.take("", "data.three")),
              fiveDivideTakeThreePointFive: LAID.take("", "data.five").divide(
                LAID.take("", "data.threePointFive")),

              fiveRemainderTwo: LAID.take("", "data.five").remainder(2),
              fiveRemainderTwoPointFive: LAID.take("", "data.five").remainder(2.5),
              fiveRemainderTakeThree: LAID.take("", "data.five").remainder(
                LAID.take("", "data.three")),
              fiveRemainderTakeThreePointFive: LAID.take("", "data.five").remainder(
                LAID.take("", "data.threePointFive")),

              takeThreeHalf: LAID.take("", "data.three").half(),
              takeThreePointFiveHalf: LAID.take("", "data.threePointFive").half(),

              takeThreeDouble: LAID.take("", "data.three").double(),
              takeThreePointFiveDouble: LAID.take("", "data.threePointFive").double(),

              twoContains: LAID.take("", "data.sampleList").contains(2),
              twoPointFiveContains: LAID.take("", "data.sampleList").contains(2.5),
              takeThreeContains: LAID.take("", "data.sampleList").contains(
                LAID.take("", "data.three")),
              takeThreePointFiveContains: LAID.take("", "data.sampleList").contains(
                LAID.take("", "data.threePointFive")),


            },
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



// TODO: check if viewport width/height matches the rootlevel

QUnit.test( "Level: root width", function( assert ) {
  assert.ok( 1 == 1, "Passed!" );
});

QUnit.test( "LAID.level() [absolute/root]", function( assert ) {
  assert.ok( LAID.level("/") === LAID.$path2level[ "/" ], "Passed!" );
});

QUnit.test( "LAID.level() [absolute/non-root]", function( assert ) {
  assert.ok( LAID.level("/Header/Text") ===
   LAID.$path2level[ "/Header/Text" ], "Passed!" );
});

QUnit.test( "LAID.level() [absolute/relative-child]", function( assert ) {
  assert.ok( LAID.level("Text", LAID.level("/Header") ) ===
   LAID.$path2level[ "/Header/Text" ], "Passed!" );
});

QUnit.test( "LAID.level() [absolute/relative-parent]", function( assert ) {
  assert.ok( LAID.level("../", LAID.level("/Header/Text") ) ===
   LAID.$path2level[ "/Header" ], "Passed!" );
});

QUnit.test( "LAID.level() [absolute/relative-sibling]", function( assert ) {
  assert.ok( LAID.level("../Body", LAID.level("/Header") ) ===
   LAID.$path2level[ "/Body" ], "Passed!" );
});

QUnit.test( "LAID.level() [absolute/relative-ancestor]", function( assert ) {
  assert.ok( LAID.level("../../", LAID.level("/Header/Text") ) ===
   LAID.$path2level[ "/" ], "Passed!" );
});

QUnit.test( "LAID.level() [absolute/relative-cousin]", function( assert ) {
  assert.ok( LAID.level("../../Body", LAID.level("/Header/Text") ) ===
   LAID.$path2level[ "/Body" ], "Passed!" );
});



QUnit.test( "LAID.rgba()", function ( assert ) {
  var color = LAID.rgba(150, 200, 250, 0.7);
  assert.ok( color.format = "rgb" );
  assert.ok( color.r = 150 );
  assert.ok( color.g = 200 );
  assert.ok( color.b = 250 );
  assert.ok( color.a = 0.7 );
});

QUnit.test( "LAID.rgb()", function ( assert ) {
  var color = LAID.rgba(150, 200, 250, 0.7);
  assert.ok( color.format = "rgb" );
  assert.ok( color.r = 150 );
  assert.ok( color.g = 200 );
  assert.ok( color.b = 250 );
});

QUnit.test( "LAID.hsla()", function ( assert ) {
  var color = LAID.hsla(100, 0.5, 0.4, 0.35 );
  assert.ok( color.format = "hsl" );
  assert.ok( color.r = 100 );
  assert.ok( color.g = 0.5 );
  assert.ok( color.b = 0.4 );
  assert.ok( color.a = 0.7 );
});

QUnit.test( "LAID.hsl()", function ( assert ) {
  var color = LAID.hsl(100, 0.5, 0.4 );
  assert.ok( color.format = "hsl" );
  assert.ok( color.r = 100 );
  assert.ok( color.g = 0.5 );
  assert.ok( color.b = 0.4 );
});


QUnit.test( "LAID.Color.equals()", function ( assert ) {
  assert.ok( LAID.rgb(60,50,100).equals(LAID.rgb(60,50,100)),
    "rgb === rgb");
  assert.ok( LAID.rgba(60,50,100, 1).equals(LAID.rgb(60,50,100)),
    "rgba === rgb"
  );
  assert.ok( LAID.rgba(60,50,100, 0.5).equals(LAID.rgba(60,50,100, 0.5)),
    "rgba === rgba"
  );

  assert.ok( LAID.hsl(70,0.4,0.5).equals(LAID.hsl(70,0.4,0.5)),
    "hsl === hsl"
  );
  assert.ok( LAID.hsla(70,0.4,0.5,1).equals(LAID.hsl(70,0.4,0.5)),
    "hsla === hsla"
  );
  assert.ok( LAID.hsla(70,0.4,0.5, 0.3).equals(LAID.hsla(70,0.4,0.5, 0.3)),
    "hsla === hsla"
  );



});

QUnit.test( "LAID.Color [rgb-to-hsl]", function ( assert ) {
    assert.ok (true);
});

QUnit.test( "LAID.color()", function ( assert ) {
  assert.ok( LAID.color("red").equals(LAID.color("red")));
  assert.ok( LAID.color("red").equals(LAID.rgb(255,0,0)));
  assert.ok( LAID.color("red").equals(LAID.rgba(255,0,0, 1)));
});


QUnit.test( "LAID.attr() [data]", function( assert ) {
  assert.ok( LAID.level("/Header/Text").attr("data.content") ===
   "Testing", "Passed!" );
});

QUnit.test( "LAID.attr() [text]", function( assert ) {
  assert.ok( LAID.level("/Header/Text").attr("text") ===
   "Testing", "Passed!" );
});


QUnit.test( "LAID.take() [self/attr/no-take]", function( assert ) {
  assert.ok( LAID.level("/Header/Text").attr("data.notTrue") ===
   false, "Passed!" );
});



QUnit.test( "LAID.take() [when]", function( assert ) {
  assert.ok( LAID.level("/Header").attr("when.click.1") ===
   doNothing1, "Passed!" );
});

QUnit.test( "LAID.take() [when/multiple]", function( assert ) {
  assert.ok( LAID.level("/Header").attr("when.click.2") ===
   doNothing2, "Passed!" );
});



QUnit.test( "LAID.Take()", function( assert ) {
  assert.ok( LAID.level("/Body/Content").attr("data.zero") ===
    0, "Single Arg" );
  assert.ok( LAID.level("/Body/Content").attr("data.zeroCopy") ===
    0, "Direct Take" );
});


QUnit.test( "LAID.Take.add()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.fiveAddTwo") ===
    5+2, "[non-take,non-float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveAddTwoPointFive") ===
    5+2.5, "[non-take,float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveAddTakeThree") ===
    5+3, "[take,non-float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveAddTakeThreePointFive") ===
    5+3.5, "[take,non-float]" );

});

QUnit.test( "LAID.Take.subtract()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.fiveSubtractTwo") ===
    5-2, "[non-take,non-float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveSubtractTwoPointFive") ===
    5-2.5, "[non-take,float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveSubtractTakeThree") ===
    5-3, "[take,non-float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveSubtractTakeThreePointFive") ===
    5-3.5, "[take,non-float]" );

});

QUnit.test( "LAID.Take.multiply()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.fiveMultiplyTwo") ===
    5*2, "[non-take,non-float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveMultiplyTwoPointFive") ===
    5*2.5, "[non-take,float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveMultiplyTakeThree") ===
    5*3, "[take,non-float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveMultiplyTakeThreePointFive") ===
    5*3.5, "[take,non-float]" );

});

QUnit.test( "LAID.Take.divide()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.fiveDivideTwo") ===
    5/2, "[non-take,non-float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveDivideTwoPointFive") ===
    5/2.5, "[non-take,float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveDivideTakeThree") ===
    5/3, "[take,non-float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveDivideTakeThreePointFive") ===
    5/3.5, "[take,non-float]" );

});

QUnit.test( "LAID.Take.remainder()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.fiveRemainderTwo") ===
    5 % 2, "[non-take,non-float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveRemainderTwoPointFive") ===
    5 % 2.5, "[non-take,float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveRemainderTakeThree") ===
    5 % 3, "[take,non-float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.fiveRemainderTakeThreePointFive") ===
    5 % 3.5, "[take,non-float]" );

});

QUnit.test( "LAID.Take.half()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.takeThreeHalf") ===
    3 / 2, "[non-float]" );


  assert.ok( LAID.level("/Body/Content").attr("data.takeThreePointFiveHalf") ===
    3.5 / 2, "[float]" );

});

QUnit.test( "LAID.Take.double()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.takeThreeDouble") ===
    3 * 2, "[non-float]" );

  assert.ok( LAID.level("/Body/Content").attr("data.takeThreePointFiveDouble") ===
    3.5 * 2, "[float]" );

});

QUnit.test( "LAID.Take.contains()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.twoContains") );
  assert.ok( LAID.level("/Body/Content").attr("data.twoPointFiveContains") );
  assert.ok( LAID.level("/Body/Content").attr("data.takeThreeContains") );
  assert.ok( LAID.level("/Body/Content").attr("data.takeThreePointFiveContains") );


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
  - For illegal take references to expander props or expander props mentioned as takes
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
    - when it has child nodes as well (which might be reponsibly for other constraints)


*/
