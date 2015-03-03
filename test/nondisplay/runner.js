

var
  qunit = require('node-qunit-phantomjs'),
  testDomainS,
  i, len,
  exec = require('child_process').exec;

  exec('ls test*.html', function (error, stdout, stderr) {
    testDomainS = stdout.trim().split("\n");
    for ( i = 0, len = testDomainS.length; i < len; i++ ) {
      qunit( "./" + testDomainS[ i ], { "verbose": false } );
    }
  });
