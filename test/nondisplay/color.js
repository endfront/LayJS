
QUnit.test( "LAID.rgba()", function ( assert ) {
  var color = LAID.rgba(150, 200, 250, 0.7);
  assert.strictEqual( color.format, "rgb" );
  assert.strictEqual( color.r, 150 );
  assert.strictEqual( color.g, 200 );
  assert.strictEqual( color.b, 250 );
  assert.strictEqual( color.a, 0.7 );
});

QUnit.test( "LAID.rgb()", function ( assert ) {
  var color = LAID.rgb(150, 200, 250);
  assert.strictEqual( color.format, "rgb" );
  assert.strictEqual( color.r, 150 );
  assert.strictEqual( color.g, 200 );
  assert.strictEqual( color.b, 250 );
  assert.strictEqual( color.a, 1 );
});

QUnit.test( "LAID.hsla()", function ( assert ) {
  var color = LAID.hsla(100, 0.5, 0.4, 0.35 );
  assert.strictEqual( color.format, "hsl" );
  assert.strictEqual( color.h, 100 );
  assert.strictEqual( color.s, 0.5 );
  assert.strictEqual( color.l, 0.4 );
  assert.strictEqual( color.a, 0.35 );
});

QUnit.test( "LAID.hsl()", function ( assert ) {
  var color = LAID.hsl(100, 0.5, 0.4 );
  assert.strictEqual( color.format, "hsl" );
  assert.strictEqual( color.h, 100 );
  assert.strictEqual( color.s, 0.5 );
  assert.strictEqual( color.l, 0.4 );
  assert.strictEqual( color.a, 1 );
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

// TODO: test
QUnit.test( "LAID.Color [rgb-to-hsl]", function ( assert ) {
    assert.ok (true);
});

QUnit.test( "LAID.color()", function ( assert ) {
  assert.ok( LAID.color("red").equals(LAID.color("red")));
  assert.ok( LAID.color("red").equals(LAID.rgb(255,0,0)));
  assert.ok( LAID.color("red").equals(LAID.rgba(255,0,0, 1)));
});
