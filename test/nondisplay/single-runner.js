var
  qunit = require('node-qunit-phantomjs');

  
qunit( "./" + process.argv[2], { "verbose": false } );
    
