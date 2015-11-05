(function() {
  "use strict";

  LAID.Many = function ( level, partLson ) {

    this.level = level;
    this.$partLson = partLson;

	  this.$stringHashedStates2_cachedAttr2val_ =  {};

    this.$id = level.$lson.$id;
    this.$id2level = {};
    this.$id2row = {};
    this.$allLevelS = [];
    this.$isLoaded = false;


  };

  LAID.Many.prototype.$init = function () {

    var
      states = this.$partLson.states || ( this.$partLson.states = {} );
    

    if ( this.$id === undefined ) {

    }

    states.formationDisplayNone = LAID.$displayNoneFormationState;
    states.formation = LAID.$formationState;

    LAID.$defaultizePart( this.$partLson );

    LAID.$newManyS.push( this );

  };

  LAID.Many.prototype.queryAll = function () {

    return new LAID.Query( this.$allLevelS );
  };

  LAID.Many.prototype.queryFiltered = function () {

    return new LAID.Query( 
      this.level.$attr2attrVal.filter.calcVal );
  };

  LAID.Many.prototype.rowsChange = function ( newRowS ) {

    this.level.$attr2attrVal.rows.update( newRowS );
    LAID.$solve();
  };

  LAID.Many.prototype.rowsMore = function ( newRowS ) {
    var
      curRowS = this.level.$attr2attrVal.rows.calcVal;

    for ( var i = 0; i < newRowS.length; i++ ) {
      curRowS.push( newRowS[ i ] );
    }

    this.level.$attr2attrVal.rows.requestRecalculation();
    
    LAID.$solve();

  };

  LAID.Many.prototype.rowsCommit = function ( newRowS ) {

    // TODO: complete
  };

  /*
  *	Update the rows by:
  * (1) Creating new levels in accordance to new rows
  * (2) Updating existing levels in accordance to changes in changed rows
  */
  LAID.Many.prototype.$updateRows = function () {
  	var 
  		rowS = this.level.$attr2attrVal.rows.calcVal,
  		row,
  		id,
  		level,
  		parentLevel = this.level.parentLevel,
      updatedLevelS = [],
      newLevelS = [],
      id2level = this.$id2level,
      id2row = this.$id2row,
      i, len;

    sortRows( rowS, this.level.$attr2attrVal.sort.calcVal );

  	for ( i = 0, len = rowS.length; i < len; i++ ) {
  		row = rowS[ i ];
  		id = row[ this.$id ];
  		level = this.$id2level[ id ];
      if ( level === null ) {
        // deleted level
        continue;
  		} else if ( !level ) {
  			level = new LAID.Level( this.level.path + ":" + id,
  			 this.$partLson, parentLevel, this, row, id );
        // the level has already been normalized
        // while LAID was parsing the "many" level
        level.$isNormalized = true;

  			parentLevel.$childLevelS.push( level );
  			id2level[ id ] = level;
        id2row[ id ] = row;
        this.$allLevelS.push( level );

        level.$createAttrVal( "$i", i + 1 );
        level.$createAttrVal( "$f", -1 );

        level.$init();

        newLevelS.push( level );

  		} else {
        // update row
        level.$attr2attrVal.$i.update( i + 1 );
        level.$attr2attrVal.$f.update( -1 );

  		}

      updatedLevelS.push( level );

  	}

    // solve as new levels might have been intoduced
    // after "Level.$identifyAndReproduce()"
    LAID.$solve();


    for ( id in id2level ) {
      level = id2level[ id ];
      if ( updatedLevelS.indexOf( level ) === -1 ) {
        level.$remove();
      }
    }

    this.level.$attr2attrVal.$all.update( this.$allLevelS );

    LAID.$solve();

  };

  LAID.Many.prototype.$updateFilter = function ( ) {

    var  
      allLevelS = this.$allLevelS,
      filteredLevelS = this.level.$attr2attrVal.filter.calcVal || [];

    for ( 
      var i = 0, len = allLevelS.length;
      i < len;
      i++
     ) {
      allLevelS[ i ].$attr2attrVal.$f.update( -1 );
    }
    for ( 
      var f = 0, len = filteredLevelS.length;
      f < len;
      f++
     ) {
      filteredLevelS[ f ].$attr2attrVal.$f.update( f + 1 );
    }

    this.level.$attr2attrVal.$filtered.update( filteredLevelS );
    this.level.$attr2attrVal.$all.update( this.$allLevelS );

    LAID.$solve();

    this.$updateFilteredPositioning();


  };

  LAID.Many.prototype.$updateFilteredPositioning = function () {

    if ( this.$isLoaded ) {
      var
        filteredLevelS = this.level.$attr2attrVal.filter.calcVal || [],
        formationFn = LAID.$formationName2fn[ this.level.$attr2attrVal.formation.calcVal ];

      for ( 
        var f = 1, len = filteredLevelS.length;
        f < len;
        f++
       ) {
        formationFn( f + 1, filteredLevelS[ f ], filteredLevelS );
      }

      LAID.$solve();
    }

  };

  LAID.Many.prototype.$removeLevel = function ( level ) {

    this.$id2level[ level.$id ] = null;
    this.$id2row[ level.$id ] = null;

    LAID.$arrayUtils.remove( this.$allLevelS, level );

  };

  LAID.Many.prototype.$updateSort = function () {
    var
      sort = this.level.$attr2attrVal.sort.calcVal,
      rowS = this.level.$attr2attrVal.rows.calcVal,
      sortedRowS = sortRows( rowsS, sort  );

    this.level.$attr2attrVal.rows.update( sortedRowS );


  };

  
  function sortRows ( rowS ) {
    return rowS;
  };

})();
