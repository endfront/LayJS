

LAY.run({
  data: {
    lang: "en"
  },
  children:{

    "Body": {
      children: {
        "Content": {
            data: {
              zero: LAY.take( 0 ),
              zeroCopy: LAY.take("", "data.zero"),
              five: 5,
              three: 3,
              threePointFive: 3.5,
              pointSeven: 0.7,
              minusOne: -1,
              sampleList: [ 2, 2.5, 3, 3.5 ],
              sampleObj: { foo: "bar" },
              yes: true,
              no: false,
              foo: "foo",
              fo: "fo",
              regexFo: /fo/,
              red: LAY.color("red"),


              fiveAddTwo: LAY.take("", "data.five").add(2),
              fiveAddTwoPointFive: LAY.take("", "data.five").add(2.5),
              fiveAddTakeThree: LAY.take("", "data.five").add(
                LAY.take("", "data.three")),
              fiveAddTakeThreePointFive: LAY.take("", "data.five").add(
                LAY.take("", "data.threePointFive")),


              fiveSubtractTwo: LAY.take("", "data.five").subtract(2),
              fiveSubtractTwoPointFive:
                LAY.take("", "data.five").subtract(2.5),
              fiveSubtractTakeThree: LAY.take("", "data.five").subtract(
                LAY.take("", "data.three")),
              fiveSubtractTakeThreePointFive:
                LAY.take("", "data.five").subtract(
                LAY.take("", "data.threePointFive")),

              fiveMultiplyTwo: LAY.take("", "data.five").multiply(2),
              fiveMultiplyTwoPointFive:
                LAY.take("", "data.five").multiply(2.5),
              fiveMultiplyTakeThree: LAY.take("", "data.five").multiply(
                LAY.take("", "data.three")),
              fiveMultiplyTakeThreePointFive:
                LAY.take("", "data.five").multiply(
                LAY.take("", "data.threePointFive")),

              fiveDivideTwo: LAY.take("", "data.five").divide(2),
              fiveDivideTwoPointFive: LAY.take("", "data.five").divide(2.5),
              fiveDivideTakeThree: LAY.take("", "data.five").divide(
                LAY.take("", "data.three")),
              fiveDivideTakeThreePointFive: LAY.take("", "data.five").divide(
                LAY.take("", "data.threePointFive")),

              fiveRemainderTwo: LAY.take("", "data.five").remainder(2),
              fiveRemainderTwoPointFive:
                LAY.take("", "data.five").remainder(2.5),
              fiveRemainderTakeThree: LAY.take("", "data.five").remainder(
                LAY.take("", "data.three")),
              fiveRemainderTakeThreePointFive:
                LAY.take("", "data.five").remainder(
                LAY.take("", "data.threePointFive")),

              halfThree: LAY.take("", "data.three").half(),
              halfThreePointFive: LAY.take("", "data.threePointFive").half(),

              doubleThree: LAY.take("", "data.three").double(),
              doubleThreePointFive:
                LAY.take("", "data.threePointFive").double(),

              containsTwo: LAY.take("", "data.sampleList").contains(2),
              containsTwoPointFive:
                LAY.take("", "data.sampleList").contains(2.5),
              containsTakeThree: LAY.take("", "data.sampleList").contains(
                LAY.take("", "data.three")),
              containsTakeThreePointFive:
                LAY.take("", "data.sampleList").contains(
                LAY.take("", "data.threePointFive")),

              sampleObjIdenticalObj: LAY.take("", "data.sampleObj").identical(
                {foo: "bar"}
              ),
              sampleObjIdenticalTakeSampleObj:
                LAY.take("", "data.sampleObj").identical(
                  LAY.take("", "data.sampleObj")
              ),

              fiveEqFive: LAY.take("", "data.five").eq(5),
              fiveEqStrFive: LAY.take("", "data.five").eq("5"),
              fiveEqTakeFive: LAY.take("", "data.five").eq(
                LAY.take("", "data.five")
              ),

              fiveNeqFive: LAY.take("", "data.five").neq(5),
              fiveNeqStrFive: LAY.take("", "data.five").neq("5"),
              fiveNeqTakeFive: LAY.take("", "data.five").neq(
                LAY.take("", "data.five")
              ),

              fiveGtFive: LAY.take("", "data.five").gt(5),
              fiveGtTakeThree: LAY.take("", "data.five").gt(
                LAY.take("", "data.three")
              ),
              fiveGtTakeThreePointFive: LAY.take("", "data.five").gt(
                LAY.take("", "data.threePointFive")
              ),

              fiveGteFive: LAY.take("", "data.five").gte(5),
              fiveGteTakeThree: LAY.take("", "data.five").gte(
                LAY.take("", "data.three")
              ),
              fiveGteTakeThreePointFive: LAY.take("", "data.five").gte(
                LAY.take("", "data.threePointFive")
              ),

              fiveLtFive: LAY.take("", "data.five").lt(5),
              fiveLtTakeThree: LAY.take("", "data.five").lt(
                LAY.take("", "data.three")
              ),
              fiveLtTakeThreePointFive: LAY.take("", "data.five").lt(
                LAY.take("", "data.threePointFive")
              ),

              fiveLteFive: LAY.take("", "data.five").lte(5),
              fiveLteTakeThree: LAY.take("", "data.five").lte(
                LAY.take("", "data.three")
              ),
              fiveLteTakeThreePointFive: LAY.take("", "data.five").lte(
                LAY.take("", "data.threePointFive")
              ),

              trueOrTrue: LAY.take("", "data.yes").or(true),
              trueOrFalse: LAY.take("", "data.yes").or(false),
              falseOrFalse: LAY.take("", "data.no").or(false),
              trueOrTakeTrue: LAY.take("", "data.yes").or(
                LAY.take("", "data.yes")),
              trueOrTakeFalse: LAY.take("", "data.yes").or(
                LAY.take("", "data.no")
              ),
              falseOrTakeFalse: LAY.take("", "data.no").or(
                LAY.take("", "data.no")
              ),

              trueAndTrue: LAY.take("", "data.yes").and(true),
              trueAndFalse: LAY.take("", "data.yes").and(false),
              falseAndFalse: LAY.take("", "data.no").and(false),
              trueAndTakeTrue: LAY.take("", "data.yes").and(
                LAY.take("", "data.yes")),
              trueAndTakeFalse: LAY.take("", "data.yes").and(
                LAY.take("", "data.no")
              ),
              falseAndTakeFalse: LAY.take("", "data.no").and(
                LAY.take("", "data.no")
              ),

              notTrue: LAY.take("", "data.yes").not(),
              notFalse: LAY.take("", "data.no").not(),

              negativeThree: LAY.take("", "data.three").negative(),
              negativeThreePointFive:
                LAY.take("", "data.threePointFive").negative(),

              keyFoo: LAY.take("", "data.sampleObj").key("foo"),
              keyTakeFoo: LAY.take("", "data.sampleObj").key(
                LAY.take("", "data.foo")),

              indexThree: LAY.take("", "data.sampleList").key(3),
              indexTakeThree: LAY.take("", "data.sampleList").key(
                LAY.take("", "data.three")),

              minFiveTwo: LAY.take("", "data.five").min(2),
              minFiveTakeThreePointFive: LAY.take("", "data.five").min(
                LAY.take("", "data.threePointFive")
              ),

              maxFiveTwo: LAY.take("", "data.five").max(2),
              maxFiveTakeThreePointFive: LAY.take("", "data.five").max(
                LAY.take("", "data.threePointFive")
              ),

              ceilThreePointFive:
                LAY.take("", "data.threePointFive").ceil(),
              floorThreePointFive:
                LAY.take("", "data.threePointFive").floor(),

              absThree: LAY.take("", "data.three").abs(),
              absMinusOne: LAY.take("", "data.minusOne").abs(),

              powFiveTwo: LAY.take("", "data.five").pow(2),
              powFiveTakeThreePointFive: LAY.take("", "data.five").pow(
                LAY.take("", "data.threePointFive")
              ),

              matchFooFo: LAY.take("", "data.foo").regexMatch("fo"),
              matchFooTakeFo: LAY.take("", "data.foo").regexMatch(
                LAY.take("", "data.fo")),

              testFoFoo: LAY.take("", "data.regexFo").regexTest("foo"),
              testFoTakeFoo: LAY.take("", "data.regexFo").regexTest(
                LAY.take("", "data.foo") ),


              fooConcatFo: LAY.take("", "data.foo").concat("fo"),
              fooConcatTakeFo: LAY.take("", "data.foo").concat(
                LAY.take( "", "data.fo")),


              formatNoArgs: LAY.take("Hello World").format(),

              formatOneNumArg: LAY.take("Order: %d").format(5),
              formatOneNumTakeArg: LAY.take("Order: %d").format(
                LAY.take("", "data.five")),

              formatOneStrArg: LAY.take("Name: %s").format("foo"),
              formatOneStrTakeArg: LAY.take("Name: %s").format(
                LAY.take("", "data.foo")),


              formatMultiArgs: LAY.take("Name: %s\nOrder: %d").format(
                "foo", 5
              ),

              formatMultiTakeArgs: LAY.take("Name: %s\nOrder: %d").format(
                LAY.take("", "data.foo" ), LAY.take("", "data.five" )
              ),

              formatMultiTakeMixedArgs:
                LAY.take("Name: %s\nOrder: %d").format(
                "foo", LAY.take("", "data.five" )
              ),

              langFormatNoArgs: LAY.take({
                en: "Hello World",
                es: "Hola Mundo"
              }).i18nFormat(),

              langFormatOneNumArg: LAY.take({
                en: "Order: %d",
                es: "Orden: %d"
              }).i18nFormat( 5),

              langFormatOneNumArg: LAY.take({
                en: "Order: %d",
                es: "Orden: %d"
              }).i18nFormat( 5 ),

              langFormatOneNumTakeArg: LAY.take({
                en: "Order: %d",
                es: "Orden: %d"
              }).i18nFormat( LAY.take("", "data.five") ),

              langFormatOneStrArg: LAY.take({
                en: "Name: %s",
                es: "Nombre: %s"
              }).i18nFormat("foo"),

              langFormatOneStrTakeArg: LAY.take({
                en: "Name: %s",
                es: "Nombre: %s"
              }).i18nFormat( LAY.take("", "data.foo")),

              langFormatMultiArgs: LAY.take({
                en: "Name: %s\nOrder: %d",
                es: "Nombre: %s\nOrden: %d"
              }).i18nFormat( "foo", 5),

              langFormatMultiTakeArgs: LAY.take({
                en: "Name: %s\nOrder: %d",
                es: "Nombre: %s\nOrden: %d"
              }).i18nFormat(
                 LAY.take("","data.foo"), LAY.take("","data.five")),

              langFormatMultiTakeMixedArgs: LAY.take({
                en: "Name: %s\nOrder: %d",
                es: "Nombre: %s\nOrden: %d"
              }).i18nFormat( LAY.take("","data.foo"), 5),

              colorEqualsWithoutTake: LAY.take("", "data.red").colorEquals(
                LAY.color("red")
              ),

              colorEqualsWithTake: LAY.take("", "data.red").colorEquals(
                LAY.take("", "data.red")
              ),

              colorLightenPointSeven:
                LAY.take("", "data.red").colorLighten( 0.7 ),
              colorLightenTakePointSeven:
                LAY.take("", "data.red").colorLighten(
                  LAY.take("","data.pointSeven") ),

              colorDarkenPointSeven:
                LAY.take("", "data.red").colorDarken( 0.7 ),
              colorDarkenTakePointSeven:
                LAY.take("", "data.red").colorDarken(
                  LAY.take("","data.pointSeven") ),

              colorStringify: LAY.take("", "data.red").colorStringify(),

              colorInvert: LAY.take("", "data.red").colorInvert(),

              colorSaturatePointSeven:
                LAY.take("", "data.red").colorSaturate( 0.7 ),
              colorSaturateTakePointSeven:
                LAY.take("", "data.red").colorSaturate(
                  LAY.take("","data.pointSeven") ),

              colorDesaturatePointSeven:
                LAY.take("", "data.red").colorDesaturate( 0.7 ),
              colorDesaturateTakePointSeven:
                LAY.take("", "data.red").colorDesaturate(
                  LAY.take("","data.pointSeven") ),


              fnNoArgs: LAY.take(function(){
                return [this, null];
              }).fn(),

              fnSingleArgFive: LAY.take(function( num ){
                return [this, num]
              }).fn( 5),

              fnSingleArgTakeFive: LAY.take(function( num ){
                return [this, num]
              }).fn( LAY.take("", "data.five")),

              fnTwoArgs: LAY.take(function(num1, num2) {
                return [this, num1+num2]
              }).fn( 5, 3.5),

              fnTwoTakeArgs: LAY.take(function(num1, num2) {
                return [this, num1+num2]
              }).fn(
                LAY.take("","data.five"),
                LAY.take("","data.threePointFive")),

              fnTwoTakeMixedArgs1: LAY.take(function(num1, num2) {
                return [this, num1+num2]
              }).fn( LAY.take("", "data.five"), 3.5),

              fnTwoTakeMixedArgs2: LAY.take(function(num1, num2) {
                return [this, num1+num2]
              }).fn( 5, LAY.take("", "data.threePointFive")),

              fnMultiArgs: LAY.take(function(num1, num2, num3) {
                return [this, num1+num2+num3]
              }).fn( 5, 3.5, 3),

              fnMultiTakeArgs: LAY.take(function(num1, num2, num3) {
                return [this, num1+num2+num3]
              }).fn(
               LAY.take("", "data.five"),
               LAY.take("", "data.threePointFive"),
               LAY.take("", "data.three")
              ),

              fnMultiTakeMixedArgs: LAY.take(function(num1, num2, num3) {
                return [this, num1+num2+num3]
              }).fn(
               LAY.take("", "data.five"),
               3.5,
               LAY.take("", "data.three")
              ),

              takeChained: LAY.take("", "data.threePointFive").add(2).add(3)

          }
        }
      }
    }
  }
});




// TODO: TEST single ARG LAY.take() HERE



QUnit.test( "LAY.Take().execute", function( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr("data.zero") ,
    0, "Single Arg" );
  assert.strictEqual( LAY.level("/Body/Content").attr("data.zeroCopy") ,
    0, "Direct Take" );
});


QUnit.test( "LAY.Take.add()", function( assert ) {

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveAddTwo") ,
    5+2, "[non-take,non-float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveAddTwoPointFive") ,
    5+2.5, "[non-take,float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveAddTakeThree") ,
    5+3, "[take,non-float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveAddTakeThreePointFive") ,
    5+3.5, "[take,non-float]" );

});

QUnit.test( "LAY.Take.subtract()", function( assert ) {

  assert.strictEqual( LAY.level("/Body/Content").attr("data.fiveSubtractTwo") ,
    5-2, "[non-take,non-float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveSubtractTwoPointFive") ,
    5-2.5, "[non-take,float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr("data.fiveSubtractTakeThree") ,
    5-3, "[take,non-float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveSubtractTakeThreePointFive") ,
    5-3.5, "[take,non-float]" );

});

QUnit.test( "LAY.Take.multiply()", function( assert ) {

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveMultiplyTwo") ,
    5*2, "[non-take,non-float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveMultiplyTwoPointFive") ,
    5*2.5, "[non-take,float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveMultiplyTakeThree") ,
    5*3, "[take,non-float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveMultiplyTakeThreePointFive") ,
    5*3.5, "[take,non-float]" );

});

QUnit.test( "LAY.Take.divide()", function( assert ) {

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveDivideTwo") ,
    5/2, "[non-take,non-float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveDivideTwoPointFive") ,
    5/2.5, "[non-take,float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveDivideTakeThree") ,
    5/3, "[take,non-float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveDivideTakeThreePointFive") ,
    5/3.5, "[take,non-float]" );

});

QUnit.test( "LAY.Take.remainder()", function( assert ) {

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveRemainderTwo") ,
    5 % 2, "[non-take,non-float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveRemainderTwoPointFive") ,
    5 % 2.5, "[non-take,float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveRemainderTakeThree") ,
    5 % 3, "[take,non-float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fiveRemainderTakeThreePointFive") ,
    5 % 3.5, "[take,non-float]" );

});

QUnit.test( "LAY.Take.half()", function( assert ) {

  assert.strictEqual( LAY.level("/Body/Content").attr("data.halfThree") ,
    3 / 2, "[non-float]" );


  assert.strictEqual( LAY.level("/Body/Content").attr("data.halfThreePointFive") ,
    3.5 / 2, "[float]" );

});

QUnit.test( "LAY.Take.double()", function( assert ) {

  assert.strictEqual( LAY.level("/Body/Content").attr("data.doubleThree") ,
    3 * 2, "[non-float]" );

  assert.strictEqual( LAY.level("/Body/Content").attr("data.doubleThreePointFive") ,
    3.5 * 2, "[float]" );

});

QUnit.test( "LAY.Take.contains()", function( assert ) {

  assert.ok( LAY.level("/Body/Content").attr("data.containsTwo") );
  assert.ok( LAY.level("/Body/Content").attr("data.containsTwoPointFive") );
  assert.ok( LAY.level("/Body/Content").attr("data.containsTakeThree") );
  assert.ok( LAY.level("/Body/Content").attr(
    "data.containsTakeThreePointFive") );

});

QUnit.test( "LAY.Take.identical()", function( assert ) {

  assert.ok( LAY.level("/Body/Content").attr("data.sampleObjIdenticalObj"),
    "non-take");
  assert.ok( LAY.level("/Body/Content").attr(
    "data.sampleObjIdenticalTakeSampleObj"),
    "take");


});

QUnit.test( "LAY.Take.eq()", function( assert ) {

  assert.ok( LAY.level("/Body/Content").attr("data.fiveEqFive"),
    "5 , 5");
  assert.ok( !LAY.level("/Body/Content").attr("data.fiveEqStrFive"),
    "5 , '5'");
  assert.ok( LAY.level("/Body/Content").attr("data.fiveEqTakeFive"),
    "5 , 5");

});

QUnit.test( "LAY.Take.neq()", function( assert ) {

  assert.ok( !LAY.level("/Body/Content").attr("data.fiveNeqFive"),
    "5 , 5");
  assert.ok( LAY.level("/Body/Content").attr("data.fiveNeqStrFive"),
    "5 , '5'");
  assert.ok( !LAY.level("/Body/Content").attr("data.fiveNeqTakeFive"),
    "5 , 5");

});

QUnit.test( "LAY.Take.gt()", function( assert ) {

  assert.ok( !LAY.level("/Body/Content").attr("data.fiveGtFive"),
    "5 > 5");
  assert.ok( LAY.level("/Body/Content").attr("data.fiveGtTakeThree"),
    "5 > 3");
  assert.ok( LAY.level("/Body/Content").attr(
    "data.fiveGtTakeThreePointFive"),
    "5 > 3.5");

});

QUnit.test( "LAY.Take.gte()", function( assert ) {

  assert.ok( LAY.level("/Body/Content").attr("data.fiveGteFive"),
    "5 >= 5");
  assert.ok( LAY.level("/Body/Content").attr("data.fiveGteTakeThree"),
    "5 >= 3");
  assert.ok( LAY.level("/Body/Content").attr(
    "data.fiveGteTakeThreePointFive"),
    "5 >= 3.5");

});


QUnit.test( "LAY.Take.lt()", function( assert ) {

  assert.ok( !LAY.level("/Body/Content").attr("data.fiveLtFive"),
    "5 < 5");
  assert.ok( !LAY.level("/Body/Content").attr("data.fiveLtTakeThree"),
    "5 < 3");
  assert.ok( !LAY.level("/Body/Content").attr(
    "data.fiveLtTakeThreePointFive"),
    "5 < 3.5");

});

QUnit.test( "LAY.Take.lte()", function( assert ) {

  assert.ok( LAY.level("/Body/Content").attr("data.fiveLteFive"),
    "5 <= 5");
  assert.ok( !LAY.level("/Body/Content").attr("data.fiveLteTakeThree"),
    "5 <= 3");
  assert.ok( !LAY.level("/Body/Content").attr(
    "data.fiveLteTakeThreePointFive"),
    "5 <= 3.5");

});

QUnit.test( "LAY.Take.or()", function( assert ) {

  assert.ok( LAY.level("/Body/Content").attr("data.trueOrTrue"),
    "true || true");
  assert.ok( LAY.level("/Body/Content").attr("data.trueOrFalse"),
    "true || false");
  assert.strictEqual(
    LAY.level("/Body/Content").attr("data.falseOrFalse") ,
    false,
    "false || false");

  assert.ok( LAY.level("/Body/Content").attr("data.trueOrTakeTrue"),
    "true || true [take]");
  assert.ok( LAY.level("/Body/Content").attr("data.trueOrTakeFalse"),
    "true || false [take]");
  assert.strictEqual(
    LAY.level("/Body/Content").attr("data.falseOrTakeFalse") ,
    false,
    "false || false [take]");

});

QUnit.test( "LAY.Take.and()", function( assert ) {

  assert.ok( LAY.level("/Body/Content").attr("data.trueAndTrue"),
    "true && true");
  assert.strictEqual( LAY.level("/Body/Content").attr("data.trueAndFalse") ,
    false,
    "true && false");
  assert.strictEqual(
    LAY.level("/Body/Content").attr("data.falseAndFalse") ,
    false,
    "false && false");

  assert.ok( LAY.level("/Body/Content").attr("data.trueAndTakeTrue"),
    "true && true [take]");
  assert.strictEqual( LAY.level("/Body/Content").attr("data.trueAndTakeFalse") ,
    false,
    "true && false [take]");
  assert.strictEqual(
    LAY.level("/Body/Content").attr("data.falseAndTakeFalse"),
    false,
    "false && false [take]");

});

QUnit.test( "LAY.Take.not()", function( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr("data.notTrue"), false,
    "!true");
  assert.strictEqual( LAY.level("/Body/Content").attr("data.notFalse"), true,
    "!false");

});

QUnit.test( "LAY.Take.negative()", function( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr("data.negativeThree") , -3,
    "-3");
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.negativeThreePointFive") , -3.5,
    "-3.5");
});


QUnit.test( "LAY.Take.key()", function( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr("data.keyFoo") ,
    "bar");
  assert.strictEqual( LAY.level("/Body/Content").attr("data.keyTakeFoo") ,
    "bar");
});

QUnit.test( "LAY.Take.index()", function( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr("data.indexThree") ,
    3.5 );
  assert.strictEqual( LAY.level("/Body/Content").attr("data.indexTakeThree") ,
    3.5 );
});

QUnit.test( "LAY.Take.min()", function( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.minFiveTwo") ,
    2);
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.minFiveTakeThreePointFive") ,
    3.5);
});

QUnit.test( "LAY.Take.max()", function( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.maxFiveTwo") ,
    5);
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.maxFiveTakeThreePointFive") ,
    5);
});

QUnit.test( "LAY.Take.ceil()", function( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.ceilThreePointFive") ,
    4);
});

QUnit.test( "LAY.Take.floor()", function( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.floorThreePointFive") ,
    3);
});

// TODO: test for trunc()

QUnit.test( "LAY.Take.abs()", function( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.absThree") , 3 );
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.absMinusOne") , 1 );
});

QUnit.test( "LAY.Take.pow()", function( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.powFiveTwo") ,
    Math.pow(5,2));
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.powFiveTakeThreePointFive") ,
    Math.pow(5, 3.5) );
});


QUnit.test( "LAY.Take.regexMatch()", function( assert ) {
  assert.deepEqual( LAY.level("/Body/Content").attr(
    "data.matchFooFo"),
    "foo".match("fo") );
  assert.deepEqual( LAY.level("/Body/Content").attr(
    "data.matchFooTakeFo"),
    "foo".match("fo") );
});

QUnit.test( "LAY.Take.regexTest()", function( assert ) {
  assert.ok( LAY.level("/Body/Content").attr(
    "data.testFoFoo") );
  assert.ok( LAY.level("/Body/Content").attr(
    "data.testFoTakeFoo"));
});


QUnit.test( "LAY.Take.concat()", function( assert ) {

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fooConcatFo") , "foofo", "without take" );

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.fooConcatTakeFo") , "foofo", "with take"  );

});


QUnit.test( "LAY.Take.format()", function( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.formatNoArgs") ,
    "Hello World",
    "formatNoArgs"
    );
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.formatOneNumArg") ,
    "Order: 5",
    "formatOneNumArg"
    );
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.formatOneNumTakeArg") ,
    "Order: 5",
    "formatOneNumArg"
    );
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.formatOneStrArg") ,
    "Name: foo",
    "formatOneStrArg"
    );
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.formatOneStrTakeArg") ,
    "Name: foo",
    "formatOneStrTakeArg");

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.formatMultiArgs") ,
    "Name: foo\nOrder: 5",
    "formatMultiArgs");

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.formatMultiTakeArgs") ,
    "Name: foo\nOrder: 5",
    "formatMultiTakeArgs");

  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.formatMultiTakeMixedArgs") ,
    "Name: foo\nOrder: 5",
    "formatMultiTakeMixedArgs");

});


QUnit.test( "LAY.Take.i18nFormat()", function( assert ) {
  function testEn( assert ) {
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatNoArgs"),
      "Hello World" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatOneNumArg"),
      "Order: 5" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatOneNumTakeArg"),
      "Order: 5" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatOneStrArg"),
      "Name: foo" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatOneStrTakeArg"),
      "Name: foo" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatMultiArgs"),
      "Name: foo\nOrder: 5" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatMultiTakeArgs"),
      "Name: foo\nOrder: 5" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatMultiTakeMixedArgs"),
      "Name: foo\nOrder: 5" );
  }

  function testEs( assert ) {
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatNoArgs"),
      "Hola Mundo" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatOneNumArg"),
      "Orden: 5" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatOneNumTakeArg") ,
      "Orden: 5" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatOneStrArg") ,
      "Nombre: foo" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatOneStrTakeArg") ,
      "Nombre: foo" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatMultiArgs") ,
      "Nombre: foo\nOrden: 5" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatMultiTakeArgs") ,
      "Nombre: foo\nOrden: 5" );
    assert.strictEqual( LAY.level("/Body/Content").attr(
      "data.langFormatMultiTakeMixedArgs") ,
      "Nombre: foo\nOrden: 5" );
    }

    testEn( assert );
    LAY.level("/").data("lang", "es");
    testEs( assert );
    LAY.level("/").data("lang", "en");
    testEn( assert );


});


QUnit.test( "LAY.Take.colorEquals()", function ( assert ) {
  assert.ok( LAY.level("/Body/Content").attr(
    "data.colorEqualsWithoutTake") );
  assert.ok( LAY.level("/Body/Content").attr(
    "data.colorEqualsWithTake") );
});


QUnit.test( "LAY.Take.colorLighten()", function ( assert ) {
  assert.ok( LAY.level("/Body/Content").attr(
    "data.colorLightenPointSeven").equals(
      LAY.color("red").lighten(0.7)
    ) );
  assert.ok( LAY.level("/Body/Content").attr(
    "data.colorLightenTakePointSeven").equals(
      LAY.color("red").lighten(0.7)
    ) );
});

QUnit.test( "LAY.Take.colorDarken()", function ( assert ) {
  assert.ok( LAY.level("/Body/Content").attr(
    "data.colorDarkenPointSeven").equals(
      LAY.color("red").darken(0.7)
    ) );
  assert.ok( LAY.level("/Body/Content").attr(
    "data.colorDarkenTakePointSeven").equals(
      LAY.color("red").darken(0.7)
    ) );
});

QUnit.test( "LAY.Take.colorStringify()", function ( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.colorStringify"),
      LAY.color("red").stringify()
    )
});

QUnit.test( "LAY.Take.colorInvert()", function ( assert ) {
  assert.ok( LAY.level("/Body/Content").attr(
    "data.colorInvert").equals(
      LAY.color("red").invert()
    ) );
});

QUnit.test( "LAY.Take.colorSaturate()", function ( assert ) {
  assert.ok( LAY.level("/Body/Content").attr(
    "data.colorSaturatePointSeven").equals(
      LAY.color("red").saturate(0.7)
    ) );
  assert.ok( LAY.level("/Body/Content").attr(
    "data.colorSaturateTakePointSeven").equals(
      LAY.color("red").saturate(0.7)
    ) );
});

QUnit.test( "LAY.Take.colorDesaturate()", function ( assert ) {
  assert.ok( LAY.level("/Body/Content").attr(
    "data.colorDesaturatePointSeven").equals(
      LAY.color("red").desaturate(0.7)
    ) );
  assert.ok( LAY.level("/Body/Content").attr(
    "data.colorDesaturateTakePointSeven").equals(
      LAY.color("red").desaturate(0.7)
    ) );
});

QUnit.test( "LAY.Take.fn()", function ( assert ) {
  var lvl = LAY.level("/Body/Content"), ret;

  ret = lvl.attr( "data.fnNoArgs" );
  assert.strictEqual(ret[0] , lvl );
  assert.strictEqual(ret[1] , null);

  ret = lvl.attr( "data.fnSingleArgFive" );
  assert.strictEqual(ret[0] , lvl);
  assert.strictEqual(ret[1] , 5);

  ret = lvl.attr( "data.fnSingleArgTakeFive" );
  assert.strictEqual(ret[0] , lvl);
  assert.strictEqual(ret[1] , 5);

  ret = lvl.attr( "data.fnTwoArgs" );
  assert.strictEqual(ret[0] , lvl);
  assert.strictEqual(ret[1] , 8.5);

  ret = lvl.attr( "data.fnTwoTakeArgs" );
  assert.strictEqual(ret[0] , lvl);
  assert.strictEqual(ret[1] , 8.5);

  ret = lvl.attr( "data.fnTwoTakeMixedArgs1" );
  assert.strictEqual(ret[0] , lvl);
  assert.strictEqual(ret[1] , 8.5);

  ret = lvl.attr( "data.fnTwoTakeMixedArgs2" );
  assert.strictEqual(ret[0] , lvl);
  assert.strictEqual(ret[1] , 8.5);

  ret = lvl.attr( "data.fnMultiArgs" );
  assert.strictEqual(ret[0] , lvl);
  assert.strictEqual(ret[1] , 11.5);

  ret = lvl.attr( "data.fnMultiTakeArgs" );
  assert.strictEqual(ret[0] , lvl);
  assert.strictEqual(ret[1] , 11.5);

  ret = lvl.attr( "data.fnMultiTakeMixedArgs" );
  assert.strictEqual(ret[0] , lvl);
  assert.strictEqual(ret[1] , 11.5);

});


QUnit.test( "LAY.Take()", function ( assert ) {
  assert.strictEqual( LAY.level("/Body/Content").attr(
    "data.takeChained"
  ) , 8.5);



});
