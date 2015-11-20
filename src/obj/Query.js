( function () {
  "use strict";
  LAID.Query = function ( rowS ) {
    this.rowS = rowS;
  };
  
  LAID.Query.prototype.filterEq = function ( key, val ) {
  	return new LAID.Query( LAID.$filterUtils.eq(
        this.rowS, key, val ) );
  };

  LAID.Query.prototype.filterNeq = function ( key, val ) {
  	return new LAID.Query( LAID.$filterUtils.neq(
      this.rowS, key, val ) );
  };

  LAID.Query.prototype.filterGt = function ( key, val ) {
  	return new LAID.Query( LAID.$filterUtils.gt(
      this.rowS, key, val ) );
  };

  LAID.Query.prototype.filterGte = function ( key, val ) {
  	return new LAID.Query( LAID.$filterUtils.gte(
      this.rowS, key, val ) );
  };
  
  LAID.Query.prototype.filterLt = function ( key, val ) {
  	return new LAID.Query( LAID.$filterUtils.lt(
      this.rowS, key, val ) );
  };

  LAID.Query.prototype.filterLte = function ( key, val ) {
  	return new LAID.Query( LAID.$filterUtils.lte(
      this.rowS, key, val ) );
  };

  LAID.Query.prototype.filterRegex = function ( key, val ) {
  	return new LAID.Query( LAID.$filterUtils.regex(
      this.rowS, key, val ) );
  };

  LAID.Query.prototype.filterContains = function ( key, val ) {
  	return new LAID.Query( LAID.$filterUtils.contains(
      this.rowS, key, val ) );
  };

  LAID.Query.prototype.filterWithin = function ( key, val ) {
    return new LAID.Query( 
      LAID.$filterUtils.within( this.rowS, key, val ) );
  };

  LAID.Query.prototype.filterFn = function ( fnFilter ) {
  	return new LAID.Query( LAID.$filterUtils.fn(
      this.rowS, fnFilter ) );
  };

  LAID.Query.prototype.foldMin = function ( key, val ) {
    return LAID.$foldUtils.min( this.rowS, key, val );
  };

  LAID.Query.prototype.foldMax = function ( key, val ) {
    return LAID.$foldUtils.max( this.rowS, key, val );
  };

  LAID.Query.prototype.foldSum = function ( key, val ) {
    return LAID.$foldUtils.sum( this.rowS, key, val );
  };

  LAID.Query.prototype.foldFn = function ( fnFold, acc ) {
    return LAID.$foldUtils.fn( this.rowS, fnFold, acc );
  };

  LAID.Query.prototype.index = function ( i ) {
  	return this.rowS[ i ];
  };

  LAID.Query.prototype.length = function () {
    return this.rowS.length;
  };
  LAID.Query.prototype.end = function () {
  	return this.rowS;
  };


 
})();
