

LAID.run({
  data: {
    lang: "en"
  },
  children:{

    "Body": {
      children: {
        "Content": {
            data: {

              zero: LAID.take( 0 ),
              zeroCopy: LAID.take("", "data.zero"),
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
              red: LAID.color("red"),


              fiveAddTwo: LAID.take("", "data.five").add(2),
              fiveAddTwoPointFive: LAID.take("", "data.five").add(2.5),
              fiveAddTakeThree: LAID.take("", "data.five").add(
                LAID.take("", "data.three")),
              fiveAddTakeThreePointFive: LAID.take("", "data.five").add(
                LAID.take("", "data.threePointFive")),


              fiveSubtractTwo: LAID.take("", "data.five").subtract(2),
              fiveSubtractTwoPointFive:
                LAID.take("", "data.five").subtract(2.5),
              fiveSubtractTakeThree: LAID.take("", "data.five").subtract(
                LAID.take("", "data.three")),
              fiveSubtractTakeThreePointFive:
                LAID.take("", "data.five").subtract(
                LAID.take("", "data.threePointFive")),

              fiveMultiplyTwo: LAID.take("", "data.five").multiply(2),
              fiveMultiplyTwoPointFive:
                LAID.take("", "data.five").multiply(2.5),
              fiveMultiplyTakeThree: LAID.take("", "data.five").multiply(
                LAID.take("", "data.three")),
              fiveMultiplyTakeThreePointFive:
                LAID.take("", "data.five").multiply(
                LAID.take("", "data.threePointFive")),

              fiveDivideTwo: LAID.take("", "data.five").divide(2),
              fiveDivideTwoPointFive: LAID.take("", "data.five").divide(2.5),
              fiveDivideTakeThree: LAID.take("", "data.five").divide(
                LAID.take("", "data.three")),
              fiveDivideTakeThreePointFive: LAID.take("", "data.five").divide(
                LAID.take("", "data.threePointFive")),

              fiveRemainderTwo: LAID.take("", "data.five").remainder(2),
              fiveRemainderTwoPointFive:
                LAID.take("", "data.five").remainder(2.5),
              fiveRemainderTakeThree: LAID.take("", "data.five").remainder(
                LAID.take("", "data.three")),
              fiveRemainderTakeThreePointFive:
                LAID.take("", "data.five").remainder(
                LAID.take("", "data.threePointFive")),

              halfThree: LAID.take("", "data.three").half(),
              halfThreePointFive: LAID.take("", "data.threePointFive").half(),

              doubleThree: LAID.take("", "data.three").double(),
              doubleThreePointFive:
                LAID.take("", "data.threePointFive").double(),

              containsTwo: LAID.take("", "data.sampleList").contains(2),
              containsTwoPointFive:
                LAID.take("", "data.sampleList").contains(2.5),
              containsTakeThree: LAID.take("", "data.sampleList").contains(
                LAID.take("", "data.three")),
              containsTakeThreePointFive:
                LAID.take("", "data.sampleList").contains(
                LAID.take("", "data.threePointFive")),


              fiveEqFive: LAID.take("", "data.five").eq(5),
              fiveEqStrFive: LAID.take("", "data.five").eq("5"),
              fiveEqTakeFive: LAID.take("", "data.five").eq(
                LAID.take("", "data.five")
              ),

              fiveNeqFive: LAID.take("", "data.five").neq(5),
              fiveNeqStrFive: LAID.take("", "data.five").neq("5"),
              fiveNeqTakeFive: LAID.take("", "data.five").neq(
                LAID.take("", "data.five")
              ),

              fiveGtFive: LAID.take("", "data.five").gt(5),
              fiveGtTakeThree: LAID.take("", "data.five").gt(
                LAID.take("", "data.three")
              ),
              fiveGtTakeThreePointFive: LAID.take("", "data.five").gt(
                LAID.take("", "data.threePointFive")
              ),

              fiveGteFive: LAID.take("", "data.five").gte(5),
              fiveGteTakeThree: LAID.take("", "data.five").gte(
                LAID.take("", "data.three")
              ),
              fiveGteTakeThreePointFive: LAID.take("", "data.five").gte(
                LAID.take("", "data.threePointFive")
              ),

              fiveLtFive: LAID.take("", "data.five").lt(5),
              fiveLtTakeThree: LAID.take("", "data.five").lt(
                LAID.take("", "data.three")
              ),
              fiveLtTakeThreePointFive: LAID.take("", "data.five").lt(
                LAID.take("", "data.threePointFive")
              ),

              fiveLteFive: LAID.take("", "data.five").lte(5),
              fiveLteTakeThree: LAID.take("", "data.five").lte(
                LAID.take("", "data.three")
              ),
              fiveLteTakeThreePointFive: LAID.take("", "data.five").lte(
                LAID.take("", "data.threePointFive")
              ),

              trueOrTrue: LAID.take("", "data.yes").or(true),
              trueOrFalse: LAID.take("", "data.yes").or(false),
              falseOrFalse: LAID.take("", "data.no").or(false),
              trueOrTakeTrue: LAID.take("", "data.yes").or(
                LAID.take("", "data.yes")),
              trueOrTakeFalse: LAID.take("", "data.yes").or(
                LAID.take("", "data.no")
              ),
              falseOrTakeFalse: LAID.take("", "data.no").or(
                LAID.take("", "data.no")
              ),

              trueAndTrue: LAID.take("", "data.yes").and(true),
              trueAndFalse: LAID.take("", "data.yes").and(false),
              falseAndFalse: LAID.take("", "data.no").and(false),
              trueAndTakeTrue: LAID.take("", "data.yes").and(
                LAID.take("", "data.yes")),
              trueAndTakeFalse: LAID.take("", "data.yes").and(
                LAID.take("", "data.no")
              ),
              falseAndTakeFalse: LAID.take("", "data.no").and(
                LAID.take("", "data.no")
              ),

              notTrue: LAID.take("", "data.yes").not(),
              notFalse: LAID.take("", "data.no").not(),

              negativeThree: LAID.take("", "data.three").negative(),
              negativeThreePointFive:
                LAID.take("", "data.threePointFive").negative(),

              keyFoo: LAID.take("", "data.sampleObj").key("foo"),
              keyTakeFoo: LAID.take("", "data.sampleObj").key(
                LAID.take("", "data.foo")),

              indexThree: LAID.take("", "data.sampleList").key(3),
              indexTakeThree: LAID.take("", "data.sampleList").key(
                LAID.take("", "data.three")),

              minFiveTwo: LAID.take("", "data.five").min(2),
              minFiveTakeThreePointFive: LAID.take("", "data.five").min(
                LAID.take("", "data.threePointFive")
              ),

              maxFiveTwo: LAID.take("", "data.five").max(2),
              maxFiveTakeThreePointFive: LAID.take("", "data.five").max(
                LAID.take("", "data.threePointFive")
              ),

              ceilThreePointFive:
                LAID.take("", "data.threePointFive").ceil(),
              floorThreePointFive:
                LAID.take("", "data.threePointFive").floor(),

              sinFive: LAID.take("", "data.five").sin(),
              cosFive: LAID.take("", "data.five").cos(),
              tanFive: LAID.take("", "data.five").tan(),

              absThree: LAID.take("", "data.three").abs(),
              absMinusOne: LAID.take("", "data.minusOne").abs(),

              powFiveTwo: LAID.take("", "data.five").pow(2),
              powFiveTakeThreePointFive: LAID.take("", "data.five").pow(
                LAID.take("", "data.threePointFive")
              ),

              logFive: LAID.take("", "data.five").log(),

              matchFooFo: LAID.take("", "data.foo").match("fo"),
              matchFooTakeFo: LAID.take("", "data.foo").match(
                LAID.take("", "data.fo")),

              testFoFoo: LAID.take("", "data.regexFo").test("foo"),
              testFoTakeFoo: LAID.take("", "data.regexFo").test(
                LAID.take("", "data.foo") ),


              fooConcatFo: LAID.take("", "data.foo").concat("fo"),
              fooConcatTakeFo: LAID.take("", "data.foo").concat(
                LAID.take( "", "data.fo")),


              formatNoArgs: LAID.take("Hello World").format(),

              formatOneNumArg: LAID.take("Order: %d").format(5),
              formatOneNumTakeArg: LAID.take("Order: %d").format(
                LAID.take("", "data.five")),

              formatOneStrArg: LAID.take("Name: %s").format("foo"),
              formatOneStrTakeArg: LAID.take("Name: %s").format(
                LAID.take("", "data.foo")),


              formatMultiArgs: LAID.take("Name: %s\nOrder: %d").format(
                "foo", 5
              ),

              formatMultiTakeArgs: LAID.take("Name: %s\nOrder: %d").format(
                LAID.take("", "data.foo" ), LAID.take("", "data.five" )
              ),

              formatMultiTakeMixedArgs:
                LAID.take("Name: %s\nOrder: %d").format(
                "foo", LAID.take("", "data.five" )
              ),

              langFormatNoArgs: LAID.take({
                en: "Hello World",
                es: "Hola Mundo"
              }).i18nFormat(),

              langFormatOneNumArg: LAID.take({
                en: "Order: %d",
                es: "Orden: %d"
              }).i18nFormat( 5),

              langFormatOneNumArg: LAID.take({
                en: "Order: %d",
                es: "Orden: %d"
              }).i18nFormat( 5 ),

              langFormatOneNumTakeArg: LAID.take({
                en: "Order: %d",
                es: "Orden: %d"
              }).i18nFormat( LAID.take("", "data.five") ),

              langFormatOneStrArg: LAID.take({
                en: "Name: %s",
                es: "Nombre: %s"
              }).i18nFormat("foo"),

              langFormatOneStrTakeArg: LAID.take({
                en: "Name: %s",
                es: "Nombre: %s"
              }).i18nFormat( LAID.take("", "data.foo")),

              langFormatMultiArgs: LAID.take({
                en: "Name: %s\nOrder: %d",
                es: "Nombre: %s\nOrden: %d"
              }).i18nFormat( "foo", 5),

              langFormatMultiTakeArgs: LAID.take({
                en: "Name: %s\nOrder: %d",
                es: "Nombre: %s\nOrden: %d"
              }).i18nFormat(
                 LAID.take("","data.foo"), LAID.take("","data.five")),

              langFormatMultiTakeMixedArgs: LAID.take({
                en: "Name: %s\nOrder: %d",
                es: "Nombre: %s\nOrden: %d"
              }).i18nFormat( LAID.take("","data.foo"), 5),

              colorEqualsWithoutTake: LAID.take("", "data.red").colorEquals(
                LAID.color("red")
              ),

              colorEqualsWithTake: LAID.take("", "data.red").colorEquals(
                LAID.take("", "data.red")
              ),

              colorLightenPointSeven:
                LAID.take("", "data.red").colorLighten( 0.7 ),
              colorLightenTakePointSeven:
                LAID.take("", "data.red").colorLighten(
                  LAID.take("","data.pointSeven") ),

              colorDarkenPointSeven:
                LAID.take("", "data.red").colorDarken( 0.7 ),
              colorDarkenTakePointSeven:
                LAID.take("", "data.red").colorDarken(
                  LAID.take("","data.pointSeven") ),

              colorStringify: LAID.take("", "data.red").colorStringify(),

              colorInvert: LAID.take("", "data.red").colorInvert(),

              colorSaturatePointSeven:
                LAID.take("", "data.red").colorSaturate( 0.7 ),
              colorSaturateTakePointSeven:
                LAID.take("", "data.red").colorSaturate(
                  LAID.take("","data.pointSeven") ),

              colorDesaturatePointSeven:
                LAID.take("", "data.red").colorDesaturate( 0.7 ),
              colorDesaturateTakePointSeven:
                LAID.take("", "data.red").colorDesaturate(
                  LAID.take("","data.pointSeven") ),

              colorAlphaPointSeven:
                LAID.take("", "data.red").colorAlpha( 0.7 ),
              colorAlphaTakePointSeven:
                LAID.take("", "data.red").colorAlpha(
                  LAID.take("","data.pointSeven") ),

              colorRedFive:
                LAID.take("", "data.red").colorRed( 5 ),
              colorRedTakeFive:
                LAID.take("", "data.red").colorRed(
                  LAID.take("","data.five") ),

              colorBlueFive:
                LAID.take("", "data.red").colorBlue( 5 ),
              colorBlueTakeFive:
                LAID.take("", "data.red").colorBlue(
                  LAID.take("","data.five") ),

              colorGreenFive:
                LAID.take("", "data.red").colorGreen( 5 ),
              colorGreenTakeFive:
                LAID.take("", "data.red").colorGreen(
                  LAID.take("","data.five") ),

              colorHueFive:
                LAID.take("", "data.red").colorHue( 5 ),
              colorHueTakeFive:
                LAID.take("", "data.red").colorHue(
                  LAID.take("","data.five") ),

              colorSaturationPointSeven:
                LAID.take("", "data.red").colorSaturation( 0.7 ),
              colorSaturationTakePointSeven:
                LAID.take("", "data.red").colorSaturation(
                  LAID.take("","data.pointSeven") ),

              colorLightnessPointSeven:
                LAID.take("", "data.red").colorLightness( 0.7 ),
              colorLightnessTakePointSeven:
                LAID.take("", "data.red").colorLightness(
                  LAID.take("","data.pointSeven") ),


              fnNoArgs: LAID.take(function(){
                return [this, null]
              }).fn(),

              fnSingleArgFive: LAID.take(function( num ){
                return [this, num]
              }).fn( 5),

              fnSingleArgTakeFive: LAID.take(function( num ){
                return [this, num]
              }).fn( LAID.take("", "data.five")),

              fnTwoArgs: LAID.take(function(num1, num2) {
                return [this, num1+num2]
              }).fn( 5, 3.5),

              fnTwoTakeArgs: LAID.take(function(num1, num2) {
                return [this, num1+num2]
              }).fn(
                LAID.take("","data.five"),
                LAID.take("","data.threePointFive")),

              fnTwoTakeMixedArgs1: LAID.take(function(num1, num2) {
                return [this, num1+num2]
              }).fn( LAID.take("", "data.five"), 3.5),

              fnTwoTakeMixedArgs2: LAID.take(function(num1, num2) {
                return [this, num1+num2]
              }).fn( 5, LAID.take("", "data.threePointFive")),

              fnMultiArgs: LAID.take(function(num1, num2, num3) {
                return [this, num1+num2+num3]
              }).fn( 5, 3.5, 3),

              fnMultiTakeArgs: LAID.take(function(num1, num2, num3) {
                return [this, num1+num2+num3]
              }).fn(
               LAID.take("", "data.five"),
               LAID.take("", "data.threePointFive"),
               LAID.take("", "data.three")
              ),

              fnMultiTakeMixedArgs: LAID.take(function(num1, num2, num3) {
                return [this, num1+num2+num3]
              }).fn(
               LAID.take("", "data.five"),
               3.5,
               LAID.take("", "data.three")
              ),

              takeChained: LAID.take("", "data.threePointFive").add(2).add(3)

          }
        }
      }
    }
  }
});




// TODO: TEST single ARG LAID.take() HEREEEEE


QUnit.test( "LAID.Take().execute", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr("data.zero") ,
    0, "Single Arg" );
  assert.strictEqual( LAID.level("/Body/Content").attr("data.zeroCopy") ,
    0, "Direct Take" );
});


QUnit.test( "LAID.Take.add()", function( assert ) {

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveAddTwo") ,
    5+2, "[non-take,non-float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveAddTwoPointFive") ,
    5+2.5, "[non-take,float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveAddTakeThree") ,
    5+3, "[take,non-float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveAddTakeThreePointFive") ,
    5+3.5, "[take,non-float]" );

});

QUnit.test( "LAID.Take.subtract()", function( assert ) {

  assert.strictEqual( LAID.level("/Body/Content").attr("data.fiveSubtractTwo") ,
    5-2, "[non-take,non-float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveSubtractTwoPointFive") ,
    5-2.5, "[non-take,float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr("data.fiveSubtractTakeThree") ,
    5-3, "[take,non-float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveSubtractTakeThreePointFive") ,
    5-3.5, "[take,non-float]" );

});

QUnit.test( "LAID.Take.multiply()", function( assert ) {

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveMultiplyTwo") ,
    5*2, "[non-take,non-float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveMultiplyTwoPointFive") ,
    5*2.5, "[non-take,float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveMultiplyTakeThree") ,
    5*3, "[take,non-float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveMultiplyTakeThreePointFive") ,
    5*3.5, "[take,non-float]" );

});

QUnit.test( "LAID.Take.divide()", function( assert ) {

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveDivideTwo") ,
    5/2, "[non-take,non-float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveDivideTwoPointFive") ,
    5/2.5, "[non-take,float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveDivideTakeThree") ,
    5/3, "[take,non-float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveDivideTakeThreePointFive") ,
    5/3.5, "[take,non-float]" );

});

QUnit.test( "LAID.Take.remainder()", function( assert ) {

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveRemainderTwo") ,
    5 % 2, "[non-take,non-float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveRemainderTwoPointFive") ,
    5 % 2.5, "[non-take,float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveRemainderTakeThree") ,
    5 % 3, "[take,non-float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fiveRemainderTakeThreePointFive") ,
    5 % 3.5, "[take,non-float]" );

});

QUnit.test( "LAID.Take.half()", function( assert ) {

  assert.strictEqual( LAID.level("/Body/Content").attr("data.halfThree") ,
    3 / 2, "[non-float]" );


  assert.strictEqual( LAID.level("/Body/Content").attr("data.halfThreePointFive") ,
    3.5 / 2, "[float]" );

});

QUnit.test( "LAID.Take.double()", function( assert ) {

  assert.strictEqual( LAID.level("/Body/Content").attr("data.doubleThree") ,
    3 * 2, "[non-float]" );

  assert.strictEqual( LAID.level("/Body/Content").attr("data.doubleThreePointFive") ,
    3.5 * 2, "[float]" );

});

QUnit.test( "LAID.Take.contains()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.containsTwo") );
  assert.ok( LAID.level("/Body/Content").attr("data.containsTwoPointFive") );
  assert.ok( LAID.level("/Body/Content").attr("data.containsTakeThree") );
  assert.ok( LAID.level("/Body/Content").attr(
    "data.containsTakeThreePointFive") );

});

QUnit.test( "LAID.Take.eq()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.fiveEqFive"),
    "5 , 5");
  assert.ok( !LAID.level("/Body/Content").attr("data.fiveEqStrFive"),
    "5 , '5'");
  assert.ok( LAID.level("/Body/Content").attr("data.fiveEqTakeFive"),
    "5 , 5");

});

QUnit.test( "LAID.Take.neq()", function( assert ) {

  assert.ok( !LAID.level("/Body/Content").attr("data.fiveNeqFive"),
    "5 , 5");
  assert.ok( LAID.level("/Body/Content").attr("data.fiveNeqStrFive"),
    "5 , '5'");
  assert.ok( !LAID.level("/Body/Content").attr("data.fiveNeqTakeFive"),
    "5 , 5");

});

QUnit.test( "LAID.Take.gt()", function( assert ) {

  assert.ok( !LAID.level("/Body/Content").attr("data.fiveGtFive"),
    "5 > 5");
  assert.ok( LAID.level("/Body/Content").attr("data.fiveGtTakeThree"),
    "5 > 3");
  assert.ok( LAID.level("/Body/Content").attr(
    "data.fiveGtTakeThreePointFive"),
    "5 > 3.5");

});

QUnit.test( "LAID.Take.gte()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.fiveGteFive"),
    "5 >= 5");
  assert.ok( LAID.level("/Body/Content").attr("data.fiveGteTakeThree"),
    "5 >= 3");
  assert.ok( LAID.level("/Body/Content").attr(
    "data.fiveGteTakeThreePointFive"),
    "5 >= 3.5");

});


QUnit.test( "LAID.Take.lt()", function( assert ) {

  assert.ok( !LAID.level("/Body/Content").attr("data.fiveLtFive"),
    "5 < 5");
  assert.ok( !LAID.level("/Body/Content").attr("data.fiveLtTakeThree"),
    "5 < 3");
  assert.ok( !LAID.level("/Body/Content").attr(
    "data.fiveLtTakeThreePointFive"),
    "5 < 3.5");

});

QUnit.test( "LAID.Take.lte()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.fiveLteFive"),
    "5 <= 5");
  assert.ok( !LAID.level("/Body/Content").attr("data.fiveLteTakeThree"),
    "5 <= 3");
  assert.ok( !LAID.level("/Body/Content").attr(
    "data.fiveLteTakeThreePointFive"),
    "5 <= 3.5");

});

QUnit.test( "LAID.Take.or()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.trueOrTrue"),
    "true || true");
  assert.ok( LAID.level("/Body/Content").attr("data.trueOrFalse"),
    "true || false");
  assert.strictEqual(
    LAID.level("/Body/Content").attr("data.falseOrFalse") ,
    false,
    "false || false");

  assert.ok( LAID.level("/Body/Content").attr("data.trueOrTakeTrue"),
    "true || true [take]");
  assert.ok( LAID.level("/Body/Content").attr("data.trueOrTakeFalse"),
    "true || false [take]");
  assert.strictEqual(
    LAID.level("/Body/Content").attr("data.falseOrTakeFalse") ,
    false,
    "false || false [take]");

});

QUnit.test( "LAID.Take.and()", function( assert ) {

  assert.ok( LAID.level("/Body/Content").attr("data.trueAndTrue"),
    "true && true");
  assert.strictEqual( LAID.level("/Body/Content").attr("data.trueAndFalse") ,
    false,
    "true && false");
  assert.strictEqual(
    LAID.level("/Body/Content").attr("data.falseAndFalse") ,
    false,
    "false && false");

  assert.ok( LAID.level("/Body/Content").attr("data.trueAndTakeTrue"),
    "true && true [take]");
  assert.strictEqual( LAID.level("/Body/Content").attr("data.trueAndTakeFalse") ,
    false,
    "true && false [take]");
  assert.strictEqual(
    LAID.level("/Body/Content").attr("data.falseAndTakeFalse"),
    false,
    "false && false [take]");

});

QUnit.test( "LAID.Take.not()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr("data.notTrue"), false,
    "!true");
  assert.strictEqual( LAID.level("/Body/Content").attr("data.notFalse"), true,
    "!false");

});

QUnit.test( "LAID.Take.negative()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr("data.negativeThree") , -3,
    "-3");
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.negativeThreePointFive") , -3.5,
    "-3.5");
});


QUnit.test( "LAID.Take.key()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr("data.keyFoo") ,
    "bar");
  assert.strictEqual( LAID.level("/Body/Content").attr("data.keyTakeFoo") ,
    "bar");
});

QUnit.test( "LAID.Take.index()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr("data.indexThree") ,
    3.5 );
  assert.strictEqual( LAID.level("/Body/Content").attr("data.indexTakeThree") ,
    3.5 );
});

QUnit.test( "LAID.Take.min()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.minFiveTwo") ,
    2);
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.minFiveTakeThreePointFive") ,
    3.5);
});

QUnit.test( "LAID.Take.max()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.maxFiveTwo") ,
    5);
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.maxFiveTakeThreePointFive") ,
    5);
});

QUnit.test( "LAID.Take.ceil()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.ceilThreePointFive") ,
    4);
});

QUnit.test( "LAID.Take.floor()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.floorThreePointFive") ,
    3);
});

QUnit.test( "LAID.Take.sin()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.sinFive") ,
    Math.sin( 5 ) );
});

QUnit.test( "LAID.Take.cos()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.cosFive") ,
    Math.cos( 5 ) );
});

QUnit.test( "LAID.Take.tan()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.tanFive") ,
    Math.tan( 5 ) );
});

QUnit.test( "LAID.Take.abs()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.absThree") , 3 );
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.absMinusOne") , 1 );
});

QUnit.test( "LAID.Take.pow()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.powFiveTwo") ,
    Math.pow(5,2));
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.powFiveTakeThreePointFive") ,
    Math.pow(5, 3.5) );
});


QUnit.test( "LAID.Take.log()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.logFive") ,
    Math.log( 5 ) );
});

QUnit.test( "LAID.Take.match()", function( assert ) {
  assert.deepEqual( LAID.level("/Body/Content").attr(
    "data.matchFooFo"),
    "foo".match("fo") );
  assert.deepEqual( LAID.level("/Body/Content").attr(
    "data.matchFooTakeFo"),
    "foo".match("fo") );
});

QUnit.test( "LAID.Take.test()", function( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.testFoFoo") );
  assert.ok( LAID.level("/Body/Content").attr(
    "data.testFoTakeFoo"));
});


QUnit.test( "LAID.Take.concat()", function( assert ) {

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fooConcatFo") , "foofo", "without take" );

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.fooConcatTakeFo") , "foofo", "with take"  );

});


QUnit.test( "LAID.Take.format()", function( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.formatNoArgs") ,
    "Hello World",
    "formatNoArgs"
    );
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.formatOneNumArg") ,
    "Order: 5",
    "formatOneNumArg"
    );
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.formatOneNumTakeArg") ,
    "Order: 5",
    "formatOneNumArg"
    );
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.formatOneStrArg") ,
    "Name: foo",
    "formatOneStrArg"
    );
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.formatOneStrTakeArg") ,
    "Name: foo",
    "formatOneStrTakeArg");

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.formatMultiArgs") ,
    "Name: foo\nOrder: 5",
    "formatMultiArgs");

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.formatMultiTakeArgs") ,
    "Name: foo\nOrder: 5",
    "formatMultiTakeArgs");

  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.formatMultiTakeMixedArgs") ,
    "Name: foo\nOrder: 5",
    "formatMultiTakeMixedArgs");

});


QUnit.test( "LAID.Take.i18nFormat()", function( assert ) {
  function testEn( assert ) {
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatNoArgs"),
      "Hello World" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatOneNumArg"),
      "Order: 5" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatOneNumTakeArg"),
      "Order: 5" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatOneStrArg"),
      "Name: foo" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatOneStrTakeArg"),
      "Name: foo" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatMultiArgs"),
      "Name: foo\nOrder: 5" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatMultiTakeArgs"),
      "Name: foo\nOrder: 5" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatMultiTakeMixedArgs"),
      "Name: foo\nOrder: 5" );
  }

  function testEs( assert ) {
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatNoArgs"),
      "Hola Mundo" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatOneNumArg"),
      "Orden: 5" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatOneNumTakeArg") ,
      "Orden: 5" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatOneStrArg") ,
      "Nombre: foo" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatOneStrTakeArg") ,
      "Nombre: foo" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatMultiArgs") ,
      "Nombre: foo\nOrden: 5" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatMultiTakeArgs") ,
      "Nombre: foo\nOrden: 5" );
    assert.strictEqual( LAID.level("/Body/Content").attr(
      "data.langFormatMultiTakeMixedArgs") ,
      "Nombre: foo\nOrden: 5" );
    }

    testEn( assert );
    LAID.level("/").data("lang", "es");
    testEs( assert );
    LAID.level("/").data("lang", "en");
    testEn( assert );


});


QUnit.test( "LAID.Take.colorEquals()", function ( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorEqualsWithoutTake") );
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorEqualsWithTake") );
});

QUnit.test( "LAID.Take.colorLighten()", function ( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorLightenPointSeven").equals(
      LAID.color("red").lighten(0.7)
    ) );
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorLightenTakePointSeven").equals(
      LAID.color("red").lighten(0.7)
    ) );
});

QUnit.test( "LAID.Take.colorDarken()", function ( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorDarkenPointSeven").equals(
      LAID.color("red").darken(0.7)
    ) );
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorDarkenTakePointSeven").equals(
      LAID.color("red").darken(0.7)
    ) );
});

QUnit.test( "LAID.Take.colorStringify()", function ( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.colorStringify"),
      LAID.color("red").stringify()
    )
});

QUnit.test( "LAID.Take.colorInvert()", function ( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorInvert").equals(
      LAID.color("red").invert()
    ) );
});

QUnit.test( "LAID.Take.colorSaturate()", function ( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorSaturatePointSeven").equals(
      LAID.color("red").saturate(0.7)
    ) );
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorSaturateTakePointSeven").equals(
      LAID.color("red").saturate(0.7)
    ) );
});

QUnit.test( "LAID.Take.colorDesaturate()", function ( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorDesaturatePointSeven").equals(
      LAID.color("red").desaturate(0.7)
    ) );
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorDesaturateTakePointSeven").equals(
      LAID.color("red").desaturate(0.7)
    ) );
});

QUnit.test( "LAID.Take.colorAlpha()", function ( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorAlphaPointSeven").equals(
      LAID.color("red").alpha(0.7)
    ) );
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorAlphaTakePointSeven").equals(
      LAID.color("red").alpha(0.7)
    ) );
});

QUnit.test( "LAID.Take.colorRed()", function ( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorRedFive").equals(
      LAID.color("red").red(5)
    ) );
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorRedTakeFive").equals(
      LAID.color("red").red(5)
    ) );
});

QUnit.test( "LAID.Take.colorBlue()", function ( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorBlueFive").equals(
      LAID.color("red").blue(5)
    ) );
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorBlueTakeFive").equals(
      LAID.color("red").blue(5)
    ) );
});

QUnit.test( "LAID.Take.colorGreen()", function ( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorGreenFive").equals(
      LAID.color("red").green(5)
    ) );
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorGreenTakeFive").equals(
      LAID.color("red").green(5)
    ) );
});

QUnit.test( "LAID.Take.colorHue()", function ( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorHueFive").equals(
      LAID.color("red").hue(5)
    ) );
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorHueTakeFive").equals(
      LAID.color("red").hue(5)
    ) );
});

QUnit.test( "LAID.Take.colorSaturation()", function ( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorSaturationPointSeven").equals(
      LAID.color("red").saturation(0.7)
    ) );
    assert.ok( LAID.level("/Body/Content").attr(
      "data.colorSaturationTakePointSeven").equals(
        LAID.color("red").saturation(0.7)
    ) );
});

QUnit.test( "LAID.Take.colorLightness()", function ( assert ) {
  assert.ok( LAID.level("/Body/Content").attr(
    "data.colorLightnessPointSeven").equals(
      LAID.color("red").lightness(0.7)
    ) );
    assert.ok( LAID.level("/Body/Content").attr(
      "data.colorLightnessTakePointSeven").equals(
        LAID.color("red").lightness(0.7)
    ) );
});

QUnit.test( "LAID.Take.fn()", function ( assert ) {
  var lvl = LAID.level("/Body/Content"), ret;

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


QUnit.test( "LAID.Take()", function ( assert ) {
  assert.strictEqual( LAID.level("/Body/Content").attr(
    "data.takeChained"
  ) , 8.5);

});
