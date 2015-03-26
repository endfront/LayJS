( function () {
  "use strict";
  LAID.Query = function ( partLevelS ) {
    this.partLevelS = partLevelS;
  };
  
  LAID.Query.prototype.filterEq = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.eq(
        this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterNeq = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.neq(
      this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterGt = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.gt(
      this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterGte = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.gte(
      this.partLevelS, attr, val ) );
  };
  
  LAID.Query.prototype.filterLt = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.lt(
      this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterLte = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.lte(
      this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterRegex = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.regex(
      this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterContains = function ( attr, val ) {
  	return new LAID.Query( LAID.$filterUtils.contains(
      this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterWithin = function ( attr, val ) {
    return new LAID.Query( 
      LAID.$filterUtils.within( this.partLevelS, attr, val ) );
  };

  LAID.Query.prototype.filterFn = function ( fnFilter ) {
  	return new LAID.Query( LAID.$filterUtils.fn(
      this.partLevelS, fnFilter ) );
  };

  LAID.Query.prototype.foldMin = function ( attr, val ) {
    return LAID.$foldUtils.min( this.partLevelS, attr, val );
  };

  LAID.Query.prototype.foldMax = function ( attr, val ) {
    return LAID.$foldUtils.max( this.partLevelS, attr, val );
  };

  LAID.Query.prototype.foldSum = function ( attr, val ) {
    return LAID.$foldUtils.sum( this.partLevelS, attr, val );
  };

  LAID.Query.prototype.foldFn = function ( fnFold, acc ) {
    return LAID.$foldUtils.fn( this.partLevelS, fnFold, acc );
  };


  LAID.Query.prototype.fetch = function ( index, attr ) {
  	return LAID.$queryUtils.fetch(
  		this.partLevelS, index, attr );
  };
  LAID.Query.prototype.length = function () {
    return this.partLevelS.length;
  };
  LAID.Query.prototype.end = function () {
  	return this.partLevelS;
  };


 
})();
