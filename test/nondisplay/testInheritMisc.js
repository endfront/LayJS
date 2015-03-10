var
  fnInternalLoad = function () {},
  fnExternalLoad = function () {},
  fnNoneLoad = function () {};


var externalInherit = {
  load: fnExternalLoad
};


LAID.run({
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


  var lvl = LAID.level("/Body/Content/Box");
  var noneLvl = lvl.level("None");
  var mixedLvl = lvl.level("Mixed");
  var internalLvl = lvl.level("Internal");
  var externalLvl = lvl.level("External");


  // without state

  assert.strictEqual(lvl.attr("width"), noneDimension);
  assert.strictEqual(lvl.attr("height"), internalDimension);
  assert.strictEqual(lvl.attr("rotateZ"), externalDimension);
  assert.strictEqual(lvl.attr("borderTopWidth"), noneDimension );
  assert.strictEqual(lvl.attr("borderRightWidth"), internalDimension );
  assert.strictEqual(lvl.attr("borderBottomWidth"), externalDimension );
  assert.strictEqual(lvl.attr("boxShadows1X"), noneDimension );
  assert.strictEqual(lvl.attr("boxShadows1Y"), internalDimension );
  assert.strictEqual(lvl.attr("boxShadows1Color"), internalColor );
  assert.strictEqual(lvl.attr("boxShadows1Blur"), externalDimension );


  // with state
  lvl.data("state", true);

  assert.strictEqual(lvl.attr("width"), stateDimension);
  assert.strictEqual(lvl.attr("height"), internalDimension);
  assert.strictEqual(lvl.attr("rotateZ"), externalDimension);
  assert.strictEqual(lvl.attr("borderTopWidth"), noneDimension );
  assert.strictEqual(lvl.attr("borderRightWidth"), stateDimension );
  assert.strictEqual(lvl.attr("borderBottomWidth"), externalDimension );
  assert.strictEqual(lvl.attr("boxShadows1X"), noneDimension );
  assert.strictEqual(lvl.attr("boxShadows1Y"), stateDimension );
  assert.strictEqual(lvl.attr("boxShadows1Color"), stateColor );
  assert.strictEqual(lvl.attr("z"), stateDimension);

  

});


