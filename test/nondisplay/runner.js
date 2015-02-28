var
  qunit = require('node-qunit-phantomjs'),
  testDomainS = ["general", "take", "color"],
  i, len;


for ( i = 0, len = testDomainS.length; i < len; i++ ) {
  qunit( "./" + testDomainS[ i ] + ".html", { "verbose": false } );
}
