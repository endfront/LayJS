( function () {
  "use strict";
  LAY.Query = function ( rowS ) {
    this.rowS = rowS;
  };
  
  LAY.Query.prototype.filterEq = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.eq(
        this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterNeq = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.neq(
      this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterGt = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.gt(
      this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterGte = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.gte(
      this.rowS, key, val ) );
  };
  
  LAY.Query.prototype.filterLt = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.lt(
      this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterLte = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.lte(
      this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterRegex = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.regex(
      this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterContains = function ( key, val ) {
  	return new LAY.Query( LAY.$filterUtils.contains(
      this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterWithin = function ( key, val ) {
    return new LAY.Query( 
      LAY.$filterUtils.within( this.rowS, key, val ) );
  };

  LAY.Query.prototype.filterFn = function ( fnFilter ) {
  	return new LAY.Query( LAY.$filterUtils.fn(
      this.rowS, fnFilter ) );
  };

  LAY.Query.prototype.foldMin = function ( key ) {
    return LAY.$foldUtils.min( this.rowS, key, val );
  };

  LAY.Query.prototype.foldMax = function ( key ) {
    return LAY.$foldUtils.max( this.rowS, key, val );
  };

  LAY.Query.prototype.foldSum = function ( key ) {
    return LAY.$foldUtils.sum( this.rowS, key, val );
  };

  LAY.Query.prototype.foldFn = function ( fnFold, acc ) {
    return LAY.$foldUtils.fn( this.rowS, fnFold, acc );
  };

  LAY.Query.prototype.index = function ( i ) {
  	return this.rowS[ i ];
  };

  LAY.Query.prototype.length = function () {
    return this.rowS.length;
  };
  LAY.Query.prototype.finish = function () {
  	return this.rowS;
  };


 
})();
