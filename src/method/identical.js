( function () {
  "use strict";
  
  // source: chai.js (https://github.com/chaijs/deep-eql)
  /*!
	* deep-eql
	* Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
	* MIT Licensed
	*/

  /**
	 * Assert super-strict (egal) equality between
	 * two objects of any type.
	 *
	 * @param {Mixed} a
	 * @param {Mixed} b
	 * @param {Array} memoised (optional)
	 * @return {Boolean} equal match
	 */

  LAY.$identical = function ( a, b ) {
  	return deepEqual( a, b, undefined );
  };

  	/*!
	* Module dependencies
	*/

	function type (x) {
		return LAY.type(x);
	}

  function deepEqual(a,b,m) {
  	var
  		typeA = type( a ),
  		typeB = type( b );

  	if ( sameValue( a, b ) ) {
			return true;
		} else if ( 'color' === typeA ) {
			return colorEqual(a, b);
		} else if ( 'level' === typeA ) {
			return levelEqual(a, b);
		} else if ('date' === typeA ) {
			return dateEqual(a, b);
		} else if ('regexp' === typeA) {
			return regexpEqual(a, b);
		} else if (Buffer.isBuffer(a)) {
			return bufferEqual(a, b);
		} else if ('arguments' === typeA) {
			return argumentsEqual(a, b, m);
		} else if (('object' !== typeA && 'object' !== typeB)
		&& ('array' !== typeA && 'array' !== typeB)) {
			return sameValue(a, b);
		} else {
			return objectEqual(a, b, m);
		}
  }

	/*!
	* Buffer.isBuffer browser shim
	*/

	var Buffer;
	try { Buffer = require('buffer').Buffer; }
	catch(ex) {
	Buffer = {};
	Buffer.isBuffer = function() { return false; }
	}

	/*!
	* Primary Export
	*/



	/*!
	* Strict (egal) equality test. Ensures that NaN always
	* equals NaN and `-0` does not equal `+0`.
	*
	* @param {Mixed} a
	* @param {Mixed} b
	* @return {Boolean} equal match
	*/

	function sameValue(a, b) {
		if (a === b) return a !== 0 || 1 / a === 1 / b;
		return a !== a && b !== b;
	}


	/*!
	* Compare two Date objects by asserting that
	* the time values are equal using `saveValue`.
	*
	* @param {Date} a
	* @param {Date} b
	* @return {Boolean} result
	*/

	function dateEqual(a, b) {
		if ('date' !== type(b)) return false;
		return sameValue(a.getTime(), b.getTime());
	}


	function colorEqual (a, b) {
		return type(b) === "color" && a.equals(b);		
	}

	function levelEqual (a, b) {
		return type(b) === "level" && ( a.pathName === b.pathName );		
	}

	/*!
	* Compare two regular expressions by converting them
	* to string and checking for `sameValue`.
	*
	* @param {RegExp} a
	* @param {RegExp} b
	* @return {Boolean} result
	*/

	function regexpEqual(a, b) {
		if ('regexp' !== type(b)) return false;
		return sameValue(a.toString(), b.toString());
	}

	/*!
	* Assert deep equality of two `arguments` objects.
	* Unfortunately, these must be sliced to arrays
	* prior to test to ensure no bad behavior.
	*
	* @param {Arguments} a
	* @param {Arguments} b
	* @param {Array} memoize (optional)
	* @return {Boolean} result
	*/

	function argumentsEqual(a, b, m) {
		if ('arguments' !== type(b)) return false;
		a = [].slice.call(a);
		b = [].slice.call(b);
		return deepEqual(a, b, m);
	}

	/*!
	* Get enumerable properties of a given object.
	*
	* @param {Object} a
	* @return {Array} property names
	*/

	function enumerable(a) {
		var res = [];
		for (var key in a) res.push(key);
		return res;
	}

	/*!
	* Simple equality for flat iterable objects
	* such as Arrays or Node.js buffers.
	*
	* @param {Iterable} a
	* @param {Iterable} b
	* @return {Boolean} result
	*/

	function iterableEqual(a, b) {
		if (a.length !==  b.length) return false;

		var i = 0;
		var match = true;

		for (; i < a.length; i++) {
		if (a[i] !== b[i]) {
		  match = false;
		  break;
		}
		}

		return match;
	}

	/*!
	* Extension to `iterableEqual` specifically
	* for Node.js Buffers.
	*
	* @param {Buffer} a
	* @param {Mixed} b
	* @return {Boolean} result
	*/

	function bufferEqual(a, b) {
		if (!Buffer.isBuffer(b)) return false;
		return iterableEqual(a, b);
	}

	/*!
	* Block for `objectEqual` ensuring non-existing
	* values don't get in.
	*
	* @param {Mixed} object
	* @return {Boolean} result
	*/

	function isValue(a) {
		return a !== null && a !== undefined;
	}

	/*!
	* Recursively check the equality of two objects.
	* Once basic sameness has been established it will
	* defer to `deepEqual` for each enumerable key
	* in the object.
	*
	* @param {Mixed} a
	* @param {Mixed} b
	* @return {Boolean} result
	*/

	function objectEqual(a, b, m) {
		if (!isValue(a) || !isValue(b)) {
			return false;
		}

		if (a.prototype !== b.prototype) {
			return false;
		}

		var i;
		if (m) {
			for (i = 0; i < m.length; i++) {
		 	 if ((m[i][0] === a && m[i][1] === b)
		 	 ||  (m[i][0] === b && m[i][1] === a)) {
		 	   return true;
		 	 }
			}
		} else {
			m = [];
		}

		try {
			var ka = enumerable(a);
			var kb = enumerable(b);
		} catch (ex) {
			return false;
		}

		ka.sort();
		kb.sort();

		if (!iterableEqual(ka, kb)) {
			return false;
		}

		m.push([ a, b ]);

		var key;
		for (i = ka.length - 1; i >= 0; i--) {
			key = ka[i];
			if (!deepEqual(a[key], b[key], m)) {
			  return false;
			}
		}

		return true;
	}




})();