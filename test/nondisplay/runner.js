

var
  qunit = require('node-qunit-phantomjs'),
  testDomainS,
  i, len,
  exec = require('child_process').exec,
  execSync = require('child_process').execSync,
  fs = require('fs');

function recursivelyTestDir( path ) {
  var fileNameS = fs.readdirSync(path);
  for ( var fileName of fileNameS ) {
    var filePath = path + "/" + fileName;
    var statFile = fs.statSync( filePath );
    if ( statFile.isDirectory() ) {
      recursivelyTestDir( filePath )
    } else if ( statFile.isFile() ) {
      if ( filePath.endsWith(".html")) {
        qunit( filePath, { verbose: false });
      }
    }
  }
}

recursivelyTestDir( execSync("pwd").toString().trim() +
  ( process.argv[ 2 ] ? ( "/" + process.argv[ 2 ] )  : "" ) );
