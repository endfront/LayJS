

var externalInherit = {
  
  data: {
    external: "external",
    mixed1: "external",
    mixed2: "external"
  },
 
  children: {
    "External": {
      data: {
        external: "external",
        mixed1: "external",
        mixed2: "external"
      }
    },
    "Mixed": {
      data: {
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
                data: {
                  internal: "internal",
                  mixed1: "internal",
                  mixed2: "internal"
                },
               
                children: {
                  "Internal": {
                    data: {
                      internal: "internal",
                      mixed1: "internal",
                      mixed2: "internal"
                    }
                  },
                  "Mixed": {
                    data: {
                      internal: "internal",
                      mixed1: "internal",
                      mixed2: "internal"
                    }
                  }
                }
              },
              "Box": {
                $inherit: [externalInherit, "../InternalInherit" ],
                data: {
                  none: "none",
                  mixed1: "none"
                },
                children: {
                  "None": {
                    data: {
                      none: "none",
                      mixed1: "none"
                    }   
                  },
                  "Mixed": {
                    data: {
                      none: "none",
                      mixed1: "none"
                    }   
                  }
                },
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

  assert.deepEqual(lvl.$lson.data, {  
    none: "none",
    mixed1: "none",
    mixed2: "internal",
    internal: "internal",
    external: "external"
  });

  assert.deepEqual(noneLvl.$lson.data, {  
    none: "none",
    mixed1: "none"
  });

  assert.deepEqual(mixedLvl.$lson.data, {  
    none: "none",
    mixed1: "none",
    mixed2: "internal",
    internal: "internal",
    external: "external"
  });


  assert.deepEqual(internalLvl.$lson.data, {  
    mixed1: "internal",
    mixed2: "internal",
    internal: "internal"
  });

  assert.deepEqual(externalLvl.$lson.data, {  
    mixed1: "external",
    mixed2: "external",
    external: "external"
  });


});


