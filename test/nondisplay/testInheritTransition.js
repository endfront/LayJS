

var noneDuration = 1;
var internalDuration = 2;
var externalDuration = 3;
var stateDuration = 4;

var fnExternalDone = function () {};
var fnStateDone = function () {};


var externalInherit = {
  
  transition: {
    all: {
      type: "external",
      duration: externalDuration,
      done: fnExternalDone,
      args: {
        external: "external",
        mixed1: "external",
        mixed2: "external"
      }
    },
    external: {
      type: "external",
      duration: externalDuration,
      args: {
        external: "external",
        mixed1: "external",
        mixed2: "external"
      }
    },
    mixed1: {
      type: "external",
      duration: externalDuration,
      args: {
        external: "external",
        mixed1: "external",
        mixed2: "external"
      }
    },
    mixed2: {
      type: "external",
      duration: externalDuration,
      args: {
        external: "external",
        mixed1: "external",
        mixed2: "external"
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
                transition: {
                  all: {
                    type: "internal",
                    duration: internalDuration,
                    args: {
                      internal: "internal",
                      mixed1: "internal",
                      mixed2: "internal"
                    }
                  },
                  internal: {
                    type: "internal",
                    duration: internalDuration,
                    args: {
                      internal: "internal",
                      mixed1: "internal",
                      mixed2: "internal"
                    }
                  },
                  mixed1: {
                    type: "internal",
                    duration: internalDuration,
                    args: {
                      internal: "internal",
                      mixed1: "internal",
                      mixed2: "internal"
                    }
                  },
                  mixed2: {
                    type: "internal",
                    duration: internalDuration,
                    args: {
                      internal: "internal",
                      mixed1: "internal",
                      mixed2: "internal"
                    }
                  }
                }
              },
              "Box": {
                inherit: [externalInherit, "../InternalInherit" ],
                data: {
                  state: false
                },
                transition: {
                  all: {
                    type: "none",
                    args: {
                      none: "none",
                      mixed1: "none"
                    }
                  },
                  none: {
                    type: "none",
                    duration: noneDuration,
                    args: {
                      none: "none",
                      mixed1: "none"
                    }
                  },
                  mixed1: {
                    type: "none",
                    args: {
                      none: "none",
                      mixed1: "none"
                    }
                  },
                  crossall: {

                  }
                },
                states: {
                  "state": {
                    onlyif: LAID.take("", "data.state"),
                    transition: {
                      all: {
                        type: "state",
                        args: {
                          mixed1: "state",
                          mixed3: "state"
                        }
                      },
                      
                      state: {
                        type: "state",
                        duration: stateDuration,
                        done: fnStateDone,
                        args: {
                          mixed2: "state"
                        }
                      }
                    }   
                  },
                  
                }
              }
            }
          }
        }
      }
    }
  });




QUnit.test( "LSON.inherit", function( assert ) {


  var lvl = LAID.level("/Body/Content/Box");
  var noneLvl = lvl.level("None");
  var mixedLvl = lvl.level("Mixed");
  var internalLvl = lvl.level("Internal");
  var externalLvl = lvl.level("External");


  // without state

  assert.strictEqual(lvl.attr("transition.all.type"), "none");
  assert.strictEqual(lvl.attr("transition.all.duration"), internalDuration);
  assert.strictEqual(lvl.attr("transition.all.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.all.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.all.args.internal"), "internal");
  assert.strictEqual(lvl.attr("transition.all.args.external"), "external");
  assert.strictEqual(lvl.attr("transition.all.args.mixed1"), "none");
  assert.strictEqual(lvl.attr("transition.all.args.mixed2"), "internal");

  assert.strictEqual(lvl.attr("transition.none.type"), "none");
  assert.strictEqual(lvl.attr("transition.none.duration"), noneDuration);
  assert.strictEqual(lvl.attr("transition.none.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.none.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.none.args.mixed1"), "none");

  // 13
  assert.strictEqual(lvl.attr("transition.internal.type"), "none");
  assert.strictEqual(lvl.attr("transition.internal.duration"), internalDuration);
  assert.strictEqual(lvl.attr("transition.internal.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.internal.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.internal.args.internal"), "internal");
  assert.strictEqual(lvl.attr("transition.internal.args.mixed1"), "none");
  assert.strictEqual(lvl.attr("transition.internal.args.mixed2"), "internal");

  // 20
  assert.strictEqual(lvl.attr("transition.external.type"), "none");
  assert.strictEqual(lvl.attr("transition.external.duration"), internalDuration);
  assert.strictEqual(lvl.attr("transition.external.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.external.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.external.args.external"), "external");
  assert.strictEqual(lvl.attr("transition.external.args.mixed1"), "none");
  assert.strictEqual(lvl.attr("transition.external.args.mixed2"), "internal");

  assert.strictEqual(lvl.attr("transition.mixed1.type"), "none");
  assert.strictEqual(lvl.attr("transition.mixed1.duration"), internalDuration);
  assert.strictEqual(lvl.attr("transition.mixed1.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.mixed1.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.mixed1.args.internal"), "internal");
  assert.strictEqual(lvl.attr("transition.mixed1.args.external"), "external");
  assert.strictEqual(lvl.attr("transition.mixed1.args.mixed1"), "none");
  assert.strictEqual(lvl.attr("transition.mixed1.args.mixed2"), "internal");

  assert.strictEqual(lvl.attr("transition.mixed2.type"), "none");
  assert.strictEqual(lvl.attr("transition.mixed2.duration"), internalDuration);
  assert.strictEqual(lvl.attr("transition.mixed2.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.mixed2.args.internal"), "internal");
  assert.strictEqual(lvl.attr("transition.mixed2.args.external"), "external");
  assert.strictEqual(lvl.attr("transition.mixed2.args.mixed1"), "none");
  assert.strictEqual(lvl.attr("transition.mixed2.args.mixed2"), "internal");

  assert.strictEqual(lvl.attr("transition.crossall.type"), "none");
  assert.strictEqual(lvl.attr("transition.crossall.duration"), internalDuration);
  assert.strictEqual(lvl.attr("transition.crossall.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.crossall.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.crossall.args.internal"), "internal");
  assert.strictEqual(lvl.attr("transition.crossall.args.external"), "external");
  assert.strictEqual(lvl.attr("transition.crossall.args.mixed1"), "none");
  assert.strictEqual(lvl.attr("transition.crossall.args.mixed2"), "internal");



  // with state
  lvl.data("state", true);

  assert.strictEqual(lvl.attr("transition.all.type"), "state");
  assert.strictEqual(lvl.attr("transition.all.duration"), internalDuration);
  assert.strictEqual(lvl.attr("transition.all.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.all.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.all.args.internal"), "internal");
  assert.strictEqual(lvl.attr("transition.all.args.external"), "external");
  assert.strictEqual(lvl.attr("transition.all.args.mixed1"), "state");
  assert.strictEqual(lvl.attr("transition.all.args.mixed2"), "internal");
  assert.strictEqual(lvl.attr("transition.all.args.mixed3"), "state");

  assert.strictEqual(lvl.attr("transition.none.type"), "state");
  assert.strictEqual(lvl.attr("transition.none.duration"), noneDuration);
  assert.strictEqual(lvl.attr("transition.none.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.none.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.none.args.mixed1"), "state");
  assert.strictEqual(lvl.attr("transition.none.args.mixed3"), "state");

  assert.strictEqual(lvl.attr("transition.internal.type"), "state");
  assert.strictEqual(lvl.attr("transition.internal.duration"), internalDuration);
  assert.strictEqual(lvl.attr("transition.internal.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.internal.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.internal.args.internal"), "internal");
  assert.strictEqual(lvl.attr("transition.internal.args.mixed1"), "state");
  assert.strictEqual(lvl.attr("transition.internal.args.mixed2"), "internal");
  assert.strictEqual(lvl.attr("transition.internal.args.mixed3"), "state");

  assert.strictEqual(lvl.attr("transition.external.type"), "state");
  assert.strictEqual(lvl.attr("transition.external.duration"), internalDuration );
  assert.strictEqual(lvl.attr("transition.external.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.external.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.external.args.internal"), "internal");
  assert.strictEqual(lvl.attr("transition.external.args.mixed1"), "state");
  assert.strictEqual(lvl.attr("transition.external.args.mixed2"), "internal");
  assert.strictEqual(lvl.attr("transition.external.args.mixed3"), "state");

  assert.strictEqual(lvl.attr("transition.mixed1.type"), "state");
  assert.strictEqual(lvl.attr("transition.mixed1.duration"), internalDuration);
  assert.strictEqual(lvl.attr("transition.mixed1.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.mixed1.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.mixed1.args.internal"), "internal");
  assert.strictEqual(lvl.attr("transition.mixed1.args.external"), "external");
  assert.strictEqual(lvl.attr("transition.mixed1.args.mixed1"), "state");
  assert.strictEqual(lvl.attr("transition.mixed1.args.mixed2"), "internal");
  assert.strictEqual(lvl.attr("transition.mixed1.args.mixed3"), "state");

  assert.strictEqual(lvl.attr("transition.mixed2.type"), "state");
  assert.strictEqual(lvl.attr("transition.mixed2.duration"), internalDuration);
  assert.strictEqual(lvl.attr("transition.mixed2.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.mixed2.args.internal"), "internal");
  assert.strictEqual(lvl.attr("transition.mixed2.args.external"), "external");
  assert.strictEqual(lvl.attr("transition.mixed2.args.mixed1"), "state");
  assert.strictEqual(lvl.attr("transition.mixed2.args.mixed2"), "internal");
  assert.strictEqual(lvl.attr("transition.mixed2.args.mixed3"), "state");

  assert.strictEqual(lvl.attr("transition.crossall.type"), "state");
  assert.strictEqual(lvl.attr("transition.crossall.duration"), internalDuration);
  assert.strictEqual(lvl.attr("transition.crossall.done"), fnExternalDone);
  assert.strictEqual(lvl.attr("transition.crossall.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.crossall.args.internal"), "internal");
  assert.strictEqual(lvl.attr("transition.crossall.args.external"), "external");
  assert.strictEqual(lvl.attr("transition.crossall.args.mixed1"), "state");
  assert.strictEqual(lvl.attr("transition.crossall.args.mixed2"), "internal");
  assert.strictEqual(lvl.attr("transition.crossall.args.mixed3"), "state");

  assert.strictEqual(lvl.attr("transition.state.type"), "state");
  assert.strictEqual(lvl.attr("transition.state.duration"), stateDuration);
  assert.strictEqual(lvl.attr("transition.state.done"), fnStateDone);
  assert.strictEqual(lvl.attr("transition.state.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.state.args.internal"), "internal");
  assert.strictEqual(lvl.attr("transition.state.args.external"), "external");
  assert.strictEqual(lvl.attr("transition.state.args.mixed1"), "state");
  assert.strictEqual(lvl.attr("transition.state.args.mixed2"), "state");
  assert.strictEqual(lvl.attr("transition.state.args.mixed3"), "state");


});


