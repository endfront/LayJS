var
  arg = process.argv[2],
  msg = process.argv[3],
  semver = require("semver"),
  util = require("util"),
  fs = require('fs'),
  p = require("child_process"),
  curVersion = fs.readFileSync("version.txt").toString().trim(),
  newVersion;

if ( arg === undefined ) {
  console.error("ERROR: Enter Arg (major|minor|patch|<version>)");
  return 1;
} else if ( !semver.valid(curVersion) ) {
  console.error("ERROR: Current git version is not valid: " + curVersion );
  return 1;
} else if ( msg === undefined ) {
  console.error("ERROR: No message provided");
  return 1;
}

var
  major = semver(curVersion).major,
  minor = semver(curVersion).minor,
  patch = semver(curVersion).patch,
  semverFormatString = "%d.%d.%d";

switch (arg) {
  case "major":
    newVersion = util.format(semverFormatString, major+1, 0, 0);
    break;
  case "minor":
    newVersion = util.format(semverFormatString, major, minor+1, 0);
    break;
  case "patch":
    newVersion = util.format(semverFormatString, major, minor, patch+1);
    break;
  default:
    if (!semver.valid(arg)) {
      console.error("ERROR: invalid semver version: " + arg );
      return 1;
    } else if ( !semver.gt(arg, curVersion )) {
      console.error("ERROR: version " + arg + " is not greater than current version " + curVersion );
      return 1;
    } else {
      newVersion = arg;
    }
}

var
  gitCommit = `git commit -a -m "${msg}"`,
  gitTag = `git tag -a v${newVersion} -m "${msg}"`,
  gitPush = "git push origin master --tags",
  npmVersion = `npm version ${newVersion}`;

fs.writeFileSync("version.txt", newVersion);
console.log(p.execSync("gulp build").toString());
console.log(p.execSync(gitCommit).toString());
console.log(p.execSync(gitTag).toString());
console.log(p.execSync(gitPush).toString());

console.log(
  p.execSync(
    `cd ../dist;cp ../LayJS/LAY.* .;${gitCommit};${npmVersion};${gitPush}`).
    toString());
