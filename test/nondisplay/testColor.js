
QUnit.test( "LAY.rgba()", function ( assert ) {
  var color = LAY.rgba(150, 200, 250, 0.7);
  assert.strictEqual( color.format, "rgb" );
  assert.strictEqual( color.r, 150 );
  assert.strictEqual( color.g, 200 );
  assert.strictEqual( color.b, 250 );
  assert.strictEqual( color.a, 0.7 );
});

QUnit.test( "LAY.rgb()", function ( assert ) {
  var color = LAY.rgb(150, 200, 250);
  assert.strictEqual( color.format, "rgb" );
  assert.strictEqual( color.r, 150 );
  assert.strictEqual( color.g, 200 );
  assert.strictEqual( color.b, 250 );
  assert.strictEqual( color.a, 1 );
});

QUnit.test( "LAY.hsla()", function ( assert ) {
  var color = LAY.hsla(100, 0.5, 0.4, 0.35 );
  assert.strictEqual( color.format, "hsl" );
  assert.strictEqual( color.h, 100 );
  assert.strictEqual( color.s, 0.5 );
  assert.strictEqual( color.l, 0.4 );
  assert.strictEqual( color.a, 0.35 );
});

QUnit.test( "LAY.hsl()", function ( assert ) {
  var color = LAY.hsl(100, 0.5, 0.4 );
  assert.strictEqual( color.format, "hsl" );
  assert.strictEqual( color.h, 100 );
  assert.strictEqual( color.s, 0.5 );
  assert.strictEqual( color.l, 0.4 );
  assert.strictEqual( color.a, 1 );
});


QUnit.test( "LAY.Color.equals()", function ( assert ) {
  assert.ok( LAY.rgb(60,50,100).equals(LAY.rgb(60,50,100)),
    "rgb === rgb");
  assert.ok( LAY.rgba(60,50,100, 1).equals(LAY.rgb(60,50,100)),
    "rgba === rgb"
  );
  assert.ok( LAY.rgba(60,50,100, 0.5).equals(LAY.rgba(60,50,100, 0.5)),
    "rgba === rgba"
  );

  assert.ok( LAY.hsl(70,0.4,0.5).equals(LAY.hsl(70,0.4,0.5)),
    "hsl === hsl"
  );
  assert.ok( LAY.hsla(70,0.4,0.5,1).equals(LAY.hsl(70,0.4,0.5)),
    "hsla === hsla"
  );
  assert.ok( LAY.hsla(70,0.4,0.5, 0.3).equals(LAY.hsla(70,0.4,0.5, 0.3)),
    "hsla === hsla"
  );



});

// TODO: test
QUnit.test( "LAY.Color [rgb-to-hsl]", function ( assert ) {
    assert.ok (true);
});

QUnit.test( "LAY.color()", function ( assert ) {
  assert.ok( LAY.color("red").equals(LAY.color("red")));
  assert.ok( LAY.color("red").equals(LAY.rgb(255,0,0)));
  assert.ok( LAY.color("red").equals(LAY.rgba(255,0,0, 1)));
});
