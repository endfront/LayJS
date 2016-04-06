
LAY.run({
  "Header": {
    "Inner": {
      "Nav": {
        many: {
          rows: [1,2,3,4]
        },
        "Inner": {
          "InnerInner": {

          }
        }
      }
    }
  },
  "Body": {
    "Pages": {
      "Page1": {
        $page: true,
        "View": {
          $view: true,
          "Inner1": {

          },
          "Inner2": {

          }
        }
      }
    }
  }
});


QUnit.test( "Level.level()", function( assert ) {

  assert.strictEqual( LAY.level("/Body").level("Pages") ,
   LAY.$pathName2level[ "/Body/Pages" ],
    "Child" );

  assert.strictEqual( LAY.level("/Body/Pages").level("../") ,
   LAY.$pathName2level[ "/Body" ], "Parent" );

  assert.strictEqual( LAY.level("/Header").level("../Body") ,
    LAY.$pathName2level[ "/Body" ], "Sibling" );

  assert.strictEqual( LAY.level("/Body/Pages").level("../../") ,
    LAY.$pathName2level[ "/" ], "Ancestor" );

  assert.strictEqual( LAY.level("/Header/Inner").level("../../Body") ,
    LAY.$pathName2level[ "/Body" ], "Cousin" );


  // many "~/"

  var
    manyLevel = LAY.level("/Header/Inner/Nav"),
    manyDerivedLevelS = manyLevel.rowsLevels();
    allManyDerivedTrue = true,
    allManyTrue = true;
  for (var i=0; i<manyDerivedLevelS.length; i++) {
    var manyDerivedLevel = manyDerivedLevelS[i];
    var manyDerivedLevelChild =
      manyDerivedLevel.children()[0];
    var manyDerivedLevelGrandchild = manyDerivedLevelChild.children()[0];

    if (
      (manyDerivedLevelChild.level("~") !==
      manyDerivedLevelChild.level("~/")) ||
      (manyDerivedLevelGrandchild.level("~") !==
      manyDerivedLevelGrandchild.level("~/")) ||
      (manyDerivedLevelChild.level("~") !== manyDerivedLevel) ||
      (manyDerivedLevelGrandchild.level("~") !== manyDerivedLevel)
     ) {
        allManyDerivedTrue = false;
        break;
    }


    if (
      (manyDerivedLevelChild.level("~/many") !==
      manyLevel) ||
      (manyDerivedLevelGrandchild.level("~/many") !==
      manyLevel) ||
      (manyDerivedLevel.level("many") !== manyLevel)
     ) {
        allManyTrue = false;
        break;
    }
  }

  assert.ok( allManyDerivedTrue, "'~/' and '~'" );
  assert.ok( allManyTrue, "many" );

  assert.ok(
    LAY.level("/Body/Pages/Page1/View/Inner1").level("^Body") ===
      LAY.level("/Body"),"^"
  );

});
