function fnNone() {
  return "none";
}
function fnExternal() {
  return "external";
}
function fnInternal() {
  return "internal";
}
function fnState1() {
  return "state1";
}
function fnState2() {
  return "state2";
}

var externalInherit = {
  
  when: {
    external: [
      fnExternal
    ],
    mixed1: [
      fnExternal
    ],
    mixed2: [
      fnExternal
    ]
  }
 
};


LAY.run({
  children:{
    "Body": {
      children: {
        "Content": {
            children: {
              "InternalInherit": {
                when: {
                  internal: [
                    fnInternal
                  ],
                  mixed1: [
                    fnInternal
                  ],
                  mixed2: [
                    fnInternal
                  ]
                }
              },
              "Box": {
                $inherit: [externalInherit, "../InternalInherit" ],
                data: {
                  state1: false,
                  state2: false
                },
                when: {
                  none: [
                    fnNone
                  ],
                  mixed1: [
                    fnNone
                  ]
                },
                states: {
                  "state1": {
                    onlyif: LAY.take("", "data.state1"),
                    when: {
                      none: [
                        fnState1
                      ],
                      mixed1: [
                        fnState1
                      ],
                      mixed3: [
                        fnState1
                      ]
                    }
                  },
                  "state2": {
                    onlyif: LAY.take("", "data.state2"),
                    when: {
                      none: [
                        fnState2
                      ],
                      mixed1: [
                        fnState2
                      ],
                      mixed3: [
                        fnState2
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });




QUnit.test( "LSON.inherit", function( assert ) {


  var lvl = LAY.level("/Body/Content/Box");
  var noneLvl = lvl.level("None");
  var mixedLvl = lvl.level("Mixed");
  var internalLvl = lvl.level("Internal");
  var externalLvl = lvl.level("External");

  assert.strictEqual(lvl.attr("$$num.when.none"), 1);
  assert.strictEqual(lvl.attr("$$num.when.internal"), 1);
  assert.strictEqual(lvl.attr("$$num.when.external"), 1);
  assert.strictEqual(lvl.attr("$$num.when.mixed1"), 3);
  assert.strictEqual(lvl.attr("$$num.when.mixed2"), 2);
  assert.strictEqual(lvl.attr("when.none.1"), fnNone );
  assert.strictEqual(lvl.attr("when.external.1"), fnExternal );
  assert.strictEqual(lvl.attr("when.internal.1"), fnInternal );
  assert.strictEqual(lvl.attr("when.mixed1.1"), fnExternal );
  assert.strictEqual(lvl.attr("when.mixed1.2"), fnInternal );
  assert.strictEqual(lvl.attr("when.mixed1.3"), fnNone );
  assert.strictEqual(lvl.attr("when.mixed2.1"), fnExternal );
  assert.strictEqual(lvl.attr("when.mixed2.2"), fnInternal );
  


  // state1 on, state2 off
  lvl.data("state1", true);

  assert.strictEqual(lvl.attr("$$num.when.none"), 2);
  assert.strictEqual(lvl.attr("$$num.when.internal"), 1);
  assert.strictEqual(lvl.attr("$$num.when.external"), 1);
  assert.strictEqual(lvl.attr("$$num.when.mixed1"), 4);
  assert.strictEqual(lvl.attr("$$num.when.mixed2"), 2);
  assert.strictEqual(lvl.attr("$$num.when.mixed3"), 1);
  assert.strictEqual(lvl.attr("when.none.1"), fnNone );
  assert.strictEqual(lvl.attr("when.none.2"), fnState1 );
  assert.strictEqual(lvl.attr("when.external.1"), fnExternal );
  assert.strictEqual(lvl.attr("when.internal.1"), fnInternal );
  assert.strictEqual(lvl.attr("when.mixed1.1"), fnExternal );
  assert.strictEqual(lvl.attr("when.mixed1.2"), fnInternal );
  assert.strictEqual(lvl.attr("when.mixed1.3"), fnNone );
  assert.strictEqual(lvl.attr("when.mixed1.4"), fnState1 );
  assert.strictEqual(lvl.attr("when.mixed2.1"), fnExternal );
  assert.strictEqual(lvl.attr("when.mixed2.2"), fnInternal );
  assert.strictEqual(lvl.attr("when.mixed3.1"), fnState1 );
  

  // state1 off, state2 on
  lvl.data("state1", false);
  lvl.data("state2", true);

  assert.strictEqual(lvl.attr("$$num.when.none"), 2);
  assert.strictEqual(lvl.attr("$$num.when.internal"), 1);
  assert.strictEqual(lvl.attr("$$num.when.external"), 1);
  assert.strictEqual(lvl.attr("$$num.when.mixed1"), 4);
  assert.strictEqual(lvl.attr("$$num.when.mixed2"), 2);
  assert.strictEqual(lvl.attr("$$num.when.mixed3"), 1);
  assert.strictEqual(lvl.attr("when.none.1"), fnNone );
  assert.strictEqual(lvl.attr("when.none.2"), fnState2 );
  assert.strictEqual(lvl.attr("when.external.1"), fnExternal );
  assert.strictEqual(lvl.attr("when.internal.1"), fnInternal );
  assert.strictEqual(lvl.attr("when.mixed1.1"), fnExternal );
  assert.strictEqual(lvl.attr("when.mixed1.2"), fnInternal );
  assert.strictEqual(lvl.attr("when.mixed1.3"), fnNone );
  assert.strictEqual(lvl.attr("when.mixed1.4"), fnState2 );
  assert.strictEqual(lvl.attr("when.mixed2.1"), fnExternal );
  assert.strictEqual(lvl.attr("when.mixed2.2"), fnInternal );
  assert.strictEqual(lvl.attr("when.mixed3.1"), fnState2 );

    
  // state1 off, state2 on
  lvl.data("state1", true);

  assert.strictEqual(lvl.attr("$$num.when.none"), 3);
  assert.strictEqual(lvl.attr("$$num.when.internal"), 1);
  assert.strictEqual(lvl.attr("$$num.when.external"), 1);
  assert.strictEqual(lvl.attr("$$num.when.mixed1"), 5);
  assert.strictEqual(lvl.attr("$$num.when.mixed2"), 2);
  assert.strictEqual(lvl.attr("$$num.when.mixed3"), 2);
  assert.strictEqual(lvl.attr("when.none.1"), fnNone );
  assert.strictEqual(lvl.attr("when.none.2"), fnState1 );
  assert.strictEqual(lvl.attr("when.none.3"), fnState2  );
  assert.strictEqual(lvl.attr("when.external.1"), fnExternal );
  assert.strictEqual(lvl.attr("when.internal.1"), fnInternal );
  assert.strictEqual(lvl.attr("when.mixed1.1"), fnExternal );
  assert.strictEqual(lvl.attr("when.mixed1.2"), fnInternal );
  assert.strictEqual(lvl.attr("when.mixed1.3"), fnNone );
  assert.strictEqual(lvl.attr("when.mixed1.4"), fnState1 );
  assert.strictEqual(lvl.attr("when.mixed1.5"), fnState2 );
  assert.strictEqual(lvl.attr("when.mixed2.1"), fnExternal );
  assert.strictEqual(lvl.attr("when.mixed2.2"), fnInternal );
  assert.strictEqual(lvl.attr("when.mixed3.1"), fnState1 );
  assert.strictEqual(lvl.attr("when.mixed3.2"), fnState2 );


});


