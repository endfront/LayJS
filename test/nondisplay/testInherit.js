function doNothing1() {

}
function doNothing2() {

}
function doNothing3() {

}

var externalInherit = {
  data: {
    msgFromFromExternalInherit: "external",
    msgFromInherit: "external"
  },
  children: {
    "ExternalInheritChild": {
      data: {
        msgFromInherit: "external"
      },
      props: {
        text: "externalInherit"
      }
    },
    "MixedInheritChild": {
      data: {
        msgFromInherit: "external",
        msgFromExternalInherit: "external"
      },
    }
  },
  when: {
    click: [
      doNothing1
    ]
  },
  load: doNothing1,
  states: {
    "external_inherit": {
      onlyif: LAID.take(1),
      install: doNothing1,
      uninstall: doNothing1,
      props: {
        width: 10
      },
      when: {
        focus: [
          doNothing1
        ]
      },
      transition: {
        width: {
          type: "linear",
          duration: 1000
        }
      }
    },
    "mixed_inherit": {
      onlyif: LAID.take(1),
      install: doNothing1,
      uninstall: doNothing1,
      props: {
        width: 10
      },
      when: {
        focus: [
          doNothing1
        ]
      },
      transition: {
        width: {
          type: "linear",
          duration: 1000
        }
      }
    }
  }
};


LAID.run({
  children:{
    "Body": {
      children: {
        "Content": {

            children: {
              "InternalInherit": {
                data: {
                  msgFromFromInternalInherit: "internal",
                  msgFromInherit: "internal"
                },
                children: {
                  "InternalInheritChild": {
                    data: {
                      msgFromInherit: "internal"
                    },
                    props: {
                      text: "internalInherit"
                    },
                    load: doNothing2
                  },
                  "MixedInheritChild": {
                    data: {
                      msgFromInherit: "internal",
                      msgFromInternalInherit: "internal"
                    },
                  }
                },
                when: {
                  click: [
                    doNothing2
                  ]
                },
                load: doNothing2,
                states: {
                  "internal_inherit": {
                    onlyif: LAID.take(2),
                    install: doNothing2,
                    uninstall: doNothing2,
                    props: {
                      width: 20
                    },
                    when: {
                      focus: [
                        doNothing2
                      ]
                    },
                    transition: {
                      width: {
                        type: "linear",
                        duration: 2000
                      }
                    }
                  },
                  "mixed_inherit": {
                    onlyif: LAID.take(2),
                    install: doNothing2,
                    uninstall: doNothing2,
                    props: {
                      width: 20
                    },
                    when: {
                      focus: [
                        doNothing2
                      ]
                    },
                    transition: {
                      width: {
                        type: "linear",
                        duration: 2000
                      }
                    }
                  }
                }
              },
              "Box": {
                inherit: [externalInherit, "../InternalInherit" ],
                data: {
                  stillGood: true,
                },
                when: {
                  click: [
                    doNothing3
                  ]
                },
                states: {
                  "no_inherit": {
                    onlyif: LAID.take(3),
                    install: doNothing3,
                    uninstall: doNothing3,
                    props: {
                      width: 30
                    },
                    when: {
                      focus: [
                        doNothing3
                      ]
                    },
                    transition: {
                      width: {
                        type: "linear",
                        duration: 3000
                      }
                    }
                  },
                  "mixed_inherit": {
                    onlyif: LAID.take(3),
                    install: doNothing3,
                    uninstall: doNothing3,
                    props: {
                      width: 30
                    },
                    when: {
                      focus: [
                        doNothing3
                      ]
                    },
                    transition: {
                      width: {
                        type: "linear",
                        duration: 3000
                      }
                    }
                  }
                },
                children: {
                  "NonInheritChild": {
                    data: {
                      good: true
                    }
                  }
                },
                load: doNothing3
              }
            }
        }
      }
    }
  }
});




QUnit.test( "LSON.inherit", function( assert ) {


  // TODO: add test cases for state (install, uninstall)
  // and props (shorthand-typed, multiple-typed)

  var lvl = LAID.level("/Body/Content/Box");

  assert.strictEqual(lvl.attr( "data.stillGood" ), true );
  assert.strictEqual(lvl.attr("when.click.3"), doNothing3 );

  assert.strictEqual(lvl.level("NonInheritChild").attr( "data.good" ), true );

  assert.strictEqual(lvl.$lson.load, doNothing3);

  // From External Inherit
  assert.strictEqual(lvl.attr( "data.msgFromFromExternalInherit"), "external");
  assert.strictEqual(lvl.level("ExternalInheritChild").attr(
    "data.msgFromInherit"), "external"
  );
  assert.strictEqual(lvl.level("ExternalInheritChild").attr(
    "text"), "externalInherit"
  );
  assert.strictEqual(lvl.attr("when.click.1"), doNothing1 );
  assert.strictEqual(lvl.level("MixedInheritChild").attr(
    "data.msgFromExternalInherit"), "external"
  );



  // From Internal Inherit
  assert.strictEqual(lvl.attr( "data.msgFromFromInternalInherit"), "internal");
  assert.strictEqual(lvl.level("InternalInheritChild").attr(
    "data.msgFromInherit"), "internal"
  );
  assert.strictEqual(lvl.level("InternalInheritChild").attr(
    "text"), "internalInherit"
  );
  assert.strictEqual(lvl.level("InternalInheritChild").$lson.load,
    doNothing2
  );
  assert.strictEqual(lvl.attr("when.click.2"), doNothing2 );
  assert.strictEqual(lvl.level("MixedInheritChild").attr(
    "data.msgFromInternalInherit"), "internal"
  );

  // From both, External and Internal inherit

  assert.strictEqual(lvl.attr( "data.msgFromInherit"), "internal");
  assert.strictEqual(lvl.level("MixedInheritChild").attr(
    "data.msgFromInherit"), "internal"
  );

  assert.strictEqual(lvl.attr("no_inherit.onlyif"), 3);
  assert.strictEqual(lvl.attr("no_inherit.install"), doNothing3);
  assert.strictEqual(lvl.attr("no_inherit.uninstall"), doNothing3);
  assert.strictEqual(lvl.attr("no_inherit.width"), 30);
  assert.strictEqual(lvl.attr("no_inherit.when.focus.1"), doNothing3);
  assert.strictEqual(lvl.attr("no_inherit.transition.width.type"), "linear");
  assert.strictEqual(lvl.attr("no_inherit.transition.width.duration"), 3000);

  assert.strictEqual(lvl.attr("internal_inherit.onlyif"), 2);
  assert.strictEqual(lvl.attr("internal_inherit.install"), doNothing2);
  assert.strictEqual(lvl.attr("internal_inherit.uninstall"), doNothing2);
  assert.strictEqual(lvl.attr("internal_inherit.width"), 20);
  assert.strictEqual(lvl.attr("internal_inherit.when.focus.1"), doNothing2);
  assert.strictEqual(lvl.attr("internal_inherit.transition.width.type"), "linear");
  assert.strictEqual(lvl.attr("internal_inherit.transition.width.duration"), 2000);

  assert.strictEqual(lvl.attr("external_inherit.onlyif"), 1);
  assert.strictEqual(lvl.attr("external_inherit.install"), doNothing1);
  assert.strictEqual(lvl.attr("external_inherit.uninstall"), doNothing1);
  assert.strictEqual(lvl.attr("external_inherit.width"), 10);
  assert.strictEqual(lvl.attr("external_inherit.when.focus.1"), doNothing1);
  assert.strictEqual(lvl.attr("external_inherit.transition.width.type"), "linear");
  assert.strictEqual(lvl.attr("external_inherit.transition.width.duration"), 1000);

  assert.strictEqual(lvl.attr("mixed_inherit.onlyif"), 3);
  assert.strictEqual(lvl.attr("mixed_inherit.install"), doNothing3);
  assert.strictEqual(lvl.attr("mixed_inherit.uninstall"), doNothing3);
  assert.strictEqual(lvl.attr("mixed_inherit.width"), 30);
  assert.strictEqual(lvl.attr("mixed_inherit.when.focus.1"), doNothing1);
  assert.strictEqual(lvl.attr("mixed_inherit.when.focus.2"), doNothing2);
  assert.strictEqual(lvl.attr("mixed_inherit.when.focus.3"), doNothing3);
  assert.strictEqual(lvl.attr("mixed_inherit.transition.width.type"), "linear");
  assert.strictEqual(lvl.attr("mixed_inherit.transition.width.duration"), 3000);





});


// TODO: write test case for inherit inheriting an inherited prop

// TODO: write a test to check for circular refs
