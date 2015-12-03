var
  fnInternalLoad = function () {},
  fnExternalLoad = function () {},
  fnNoneLoad = function () {};


var externalInherit = {
  load: fnExternalLoad
};


LAY.run({
  children:{
    "Body": {
      children: {
        "Content": {
            children: {
              "InternalInherit": {
                
              },
              "Box": {
                $inherit: [externalInherit, "../InternalInherit" ],
                
                
                
                states: {
                  "state1": {
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


  var lvl = LAY.level("/Body/Content/Box");
  var noneLvl = lvl.level("None");
  var mixedLvl = lvl.level("Mixed");
  var internalLvl = lvl.level("Internal");
  var externalLvl = lvl.level("External");


  // without state

  assert.strictEqual(true, true);

});


