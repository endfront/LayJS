(function () {
  "use strict";

  // source: https://github.com/pvorb/node-clone/blob/master/clone.js

  function objectToString(o) {
    return Object.prototype.toString.call(o);
  }

  // shim for Node's 'util' package
  // DO NOT REMOVE THIS! It is required for compatibility with EnderJS (http://enderjs.com/).
  var util = {
    isArray: function (ar) {
      return Array.isArray(ar) || (typeof ar === 'object' && objectToString(ar) === '[object Array]');
    },
    isDate: function (d) {
      return typeof d === 'object' && objectToString(d) === '[object Date]';
    },
    isRegExp: function (re) {
      return typeof re === 'object' && objectToString(re) === '[object RegExp]';
    },
    getRegExpFlags: function (re) {
      var flags = '';
      re.global && (flags += 'g');
      re.ignoreCase && (flags += 'i');
      re.multiline && (flags += 'm');
      return flags;
    }
  };


  /**
  * Clones (copies) an Object using deep copying.
  *
  * This function supports circular references by default, but if you are certain
  * there are no circular references in your object, you can save some CPU time
  * by calling clone(obj, false).
  *
  * Caution: if `circular` is false and `parent` contains circular references,
  * your program may enter an infinite loop and crash.
  *
  * @param `parent` - the object to be cloned
  */

  LAY.$clone = function (parent) {
    // maintain two arrays for circular references, where corresponding parents
    // and children have the same index

    if ( typeof parent !== "object" ) {
      return parent;
    }

    var allParents = [];
    var allChildren = [];

    var circular = true;

    var depth = Infinity;

    // recurse this function so we don't reset allParents and allChildren
    function _clone(parent, depth) {
      // cloning null always returns null
      if (parent === null)
        return null;

        if (depth === 0)
          return parent;

          var child;
          var proto;
          if (typeof parent != 'object') {
            return parent;
          }
          if ( parent instanceof LAY.Color ) {
            return parent.copy();
          }

          if (util.isArray(parent)) {
            child = [];
          } else if (util.isRegExp(parent)) {
            child = new RegExp(parent.source, util.getRegExpFlags(parent));
            if (parent.lastIndex) child.lastIndex = parent.lastIndex;
          } else if (util.isDate(parent)) {
            child = new Date(parent.getTime());
          } else {
            proto = Object.getPrototypeOf(parent);
            child = Object.create(proto);
          }

          if (circular) {
            var index = allParents.indexOf(parent);

            if (index != -1) {
              return allChildren[index];
            }
            allParents.push(parent);
            allChildren.push(child);
          }

          for (var i in parent) {
            var attrs;
            if (proto) {
              attrs = Object.getOwnPropertyDescriptor(proto, i);
            }

            if (attrs && attrs.set === null) {
              continue;
            }
            child[i] = _clone(parent[i], depth - 1);
          }

          return child;
        }

        return _clone(parent, depth);
      };



    })();
