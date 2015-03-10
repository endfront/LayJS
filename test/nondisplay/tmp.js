 assert.strictEqual(lvl.attr("when.click.1"), doNothingExternal);
  assert.strictEqual(lvl.attr("when.click.2"), doNothingInternal);
  assert.strictEqual(lvl.attr("when.click.3"), doNothingNone);
  assert.strictEqual(lvl.attr("when.focus.1"), doNothingExternal);
  assert.strictEqual(lvl.attr("when.focus.2"), doNothingInternal);

  assert.strictEqual(lvl.attr("transition.all.type"), "none");
  assert.strictEqual(lvl.attr("transition.all.duration"), "internal");
  assert.strictEqual(lvl.attr("transition.all.done"), doNothingExternal);
  assert.strictEqual(lvl.attr("transition.all.args.none"), "none");
  assert.strictEqual(lvl.attr("transition.all.args.external"), "external");
  assert.strictEqual(lvl.attr("transition.all.args.internal"), "internal");
  assert.strictEqual(lvl.attr("transition.all.args.mixed"), "internal");
   

  assert.strictEqual(lvl.attr("transition.internal.args.type"), "internal");
  assert.strictEqual(lvl.attr("transition.internal.args.type"), "internal");
