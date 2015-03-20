( function () {
  "use strict";
  LAID.Filter = function ( rowsWrapper ) {
    this.rowsWrapper = rowsWrapper;
  };
  
  LAID.Filter.prototype.eq = function ( val ) {
  	return new LAID.Filter( LAID.$filterUtils.eq( this.rowsWrapper, val ) );
  };

  LAID.Filter.prototype.neq = function ( val ) {
  	return new LAID.Filter( LAID.$filterUtils.neq( this.rowsWrapper, val ) );
  };

  LAID.Filter.prototype.gt = function ( val ) {
  	return new LAID.Filter( LAID.$filterUtils.gt( this.rowsWrapper, val ) );
  };

  LAID.Filter.prototype.gte = function ( val ) {
  	return new LAID.Filter( LAID.$filterUtils.gte( this.rowsWrapper, val ) );
  };
  
  LAID.Filter.prototype.lt = function ( val ) {
  	return new LAID.Filter( LAID.$filterUtils.lt( this.rowsWrapper, val ) );
  };

  LAID.Filter.prototype.lte = function ( val ) {
  	return new LAID.Filter( LAID.$filterUtils.lte( this.rowsWrapper, val ) );
  };

  LAID.Filter.prototype.regex = function ( val ) {
  	return new LAID.Filter( LAID.$filterUtils.regex( this.rowsWrapper, val ) );
  };

  LAID.Filter.prototype.contains = function ( val ) {
  	return new LAID.Filter( LAID.$filterUtils.contains( this.rowsWrapper, val ) );
  };

  LAID.Filter.prototype.fn = function ( fnFilter ) {
  	return new LAID.Filter( LAID.$filterUtils.fn( this.rowsWrapper, fnFilter ) );
  };

  LAID.Filter.prototype.fetch = function ( index, attr ) {
  	return LAID.$filterUtils.fetch(
  		this.rowsWrapper, index, attr );
  };

  LAID.Filter.prototype.end = function () {
  	return this.rowsWrapper.rows;
  };


 
})();
