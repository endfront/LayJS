(function() {
  "use strict";

  LAID.Many = function ( level, partLson ) {

    this.level = level;
    this.partLson = partLson;

    // "stringHashedStates2_cachedAttr2val_"
    // for levels derived from the many
    // Keeping this cache ensures thats
    // each derived level (which could potentially
    // large arbitrary number n) calculates
    // only once.
	  this.levelStringHashedStates2_cachedAttr2val_ = {};

    this.id = level.lson.id || "id";
    this.id2level = {};
    this.id2row = {};
    this.isLoaded = false;

    this.defaultFormationX = undefined;
    this.defaultFormationY = undefined;

  };

  LAID.Many.prototype.init = function () {

    var
      states = this.partLson.states ||
      ( this.partLson.states = {} );

    states.formationDisplayNone =
      LAID.$formationDisplayNoneState;

    LAID.$defaultizePartLson( this.partLson, false );

    LAID.$newManyS.push( this );

    this.level.$createAttrVal( "$all", [] );
    this.level.$createAttrVal( "$filtered", [] );

    this.defaultFormationX = this.partLson.states.root.props.left;
    this.defaultFormationY = this.partLson.states.root.props.top;

  };

  LAID.Many.prototype.queryAll = function () {
    return new LAID.Query( 
       LAID.$arrayUtils.cloneSingleLevel(
        this.level.attr2attrVal.$all.calcVal ) );
  };

  LAID.Many.prototype.queryFiltered = function () {
    return new LAID.Query(
      LAID.$arrayUtils.cloneSingleLevel(
        this.level.attr2attrVal.$filtered.calcVal ) );
  };

  LAID.Many.prototype.rowsCommit = function ( newRowS ) {

    this.level.attr2attrVal.rows.update( newRowS );
    LAID.$solve();

  };

  LAID.Many.prototype.rowsMore = function ( newRowS ) {
    var
      curRowS = this.level.attr2attrVal.rows.calcVal;

    for ( var i = 0; i < newRowS.length; i++ ) {
      curRowS.push( newRowS[ i ] );
    }

    this.level.attr2attrVal.rows.requestRecalculation();
    
    LAID.$solve();

  };

  LAID.Many.prototype.rowDelete = function ( id ) {
    var
      curRowS = this.level.attr2attrVal.rows.calcVal,
      row = this.id2row [ id ];

    if ( row ) {
      LAID.$arrayUtils.remove( 
        curRowS, row );
      this.level.attr2attrVal.rows.requestRecalculation();

      LAID.$solve();

    }


  };


  function checkIfRowsIsNotObjectified ( rowS ) {
    return rowS.length &&
     ( typeof rowS[ 0 ] !== "object" );
  }

  function objectifyRows ( rowS ) {
    var objectifiedRowS = [];
    for ( var i = 0, len = rowS.length; i < len; i++ ) {
      objectifiedRowS.push( { id:i+1, content: rowS[ i ] }); 
    }
    return objectifiedRowS;
  }

  /*
  *	Update the rows by:
  * (1) Creating new levels in accordance to new rows
  * (2) Updating existing levels in accordance to changes in changed rows
  */
  LAID.Many.prototype.updateRows = function () {
  	var 
  		rowS = this.level.attr2attrVal.rows.calcVal,
  		row,
  		id,
  		level,
  		parentLevel = this.level.parentLevel,
      updatedLevelS = [],
      newLevelS = [],
      id2level = this.id2level,
      id2row = this.id2row,
      rowKey, rowVal,
      i, len;

    if ( checkIfRowsIsNotObjectified ( rowS ) ) {
      rowS = objectifyRows( rowS );
    }

    this.sort( rowS );

  	for ( i = 0, len = rowS.length; i < len; i++ ) {
  		row = rowS[ i ];
  		id = row[ this.id ];
      id2row[ id ] = row;
  		level = this.id2level[ id ];
      
      if ( !level ) {
        // create new level with row
  			level = new LAID.Level( this.level.pathName + ":" + id,
  			 this.partLson, parentLevel, this, row, id );
        level.$init();
        // the level has already been normalized
        // while LAID was parsing the "many" level
        level.isNormalized = true;

  			parentLevel.childLevelS.push( level );
  			id2level[ id ] = level;
        id2row[ id ] = row;

        level.$createAttrVal( "$i", i + 1 );
        level.$createAttrVal( "$f", -1 );

        newLevelS.push( level );

		  } else {
        // update level with new row changes
        level.attr2attrVal.$i.update( i + 1 );

        for ( rowKey in row ) {
          rowVal = row[ rowKey ];
          if ( !level.attr2attrVal[ "row." + rowKey ] ) {
            level.$createAttrVal( "row." + rowKey, rowVal );
          } else {
            level.$changeAttrVal( "row." + rowKey, rowVal );           
          }
        }
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
        this.id2row[ id ] = undefined;
        this.id2level[ id ] = undefined;
      }
    }

    LAID.$solve();

    this.level.attr2attrVal.$all.update( updatedLevelS );
    this.level.attr2attrVal.$all.requestRecalculation();

    LAID.$solve();


  };

  LAID.Many.prototype.updateFilter = function ( ) {
    var  
      allLevelS = this.level.attr2attrVal.$all.calcVal || [],
      filteredLevelS = this.level.attr2attrVal.filter.calcVal || [];

    for ( 
      var i = 0, len = allLevelS.length;
      i < len;
      i++
     ) {
      allLevelS[ i ].attr2attrVal.$f.update( -1 );
    }
    for ( 
      var f = 0, len = filteredLevelS.length;
      f < len;
      f++
     ) {
      filteredLevelS[ f ].attr2attrVal.$f.update( f + 1 );
    }

    this.level.attr2attrVal.$filtered.update( filteredLevelS );

    LAID.$solve();

    this.updateFilteredPositioning();

  };

  LAID.Many.prototype.updateFilteredPositioning = function () {

    if ( this.isLoaded ) {
      var
        filteredLevelS = this.level.attr2attrVal.filter.calcVal || [],
        formationFn = LAID.$formationName2fn[
          this.level.attr2attrVal.formation.calcVal ],
        firstFilteredLevel = filteredLevelS[ 0 ];

      if ( firstFilteredLevel && firstFilteredLevel.part ) {
        firstFilteredLevel.$setFormationXY(
          undefined, undefined );
      }
      for ( 
        var f = 1, len = filteredLevelS.length, filteredLevel;
        f < len;
        f++
       ) {
        filteredLevel = filteredLevelS[ f ];
        // if the level is not initialized then
        // discontinue the filtered positioning
        if ( !filteredLevel.part ) {
          return;
        }
        formationFn( f + 1, filteredLevelS[ f ], filteredLevelS );
      }

      LAID.$solve();
    }

  };

  

  LAID.Many.prototype.sort = function ( rowS ) {
    var sortAttrPrefix,
      attr2attrVal = this.level.attr2attrVal,
      numSorts = attr2attrVal["$$num.sort"] ?
        attr2attrVal["$$num.sort"].calcVal : 0,
      sortDictS = [];

    for ( var i=0; i<numSorts; i++ ) {
      sortAttrPrefix = "sort." + ( i + 1 ) + ".";
    
      sortDictS.push(
        { key:attr2attrVal[ sortAttrPrefix + "key" ].calcVal,
        ascending:
        attr2attrVal[ sortAttrPrefix + "ascending" ].calcVal  });
    }

    rowS.sort( dynamicSortMultiple( sortDictS ) );

  };

  


 


  // below code is taken from one of the responses
  // to the stackoverflow question:
  // http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
  // source: http://stackoverflow.com/a/4760279

  function dynamicSort( sortDict ) {
    var key = sortDict.key,
      sortOrder = sortDict.ascending ? 1 : -1;

    return function (a,b) {
        var result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
        return result * sortOrder;
    }
  }

  function dynamicSortMultiple( sortDictS ) {
    
    return function (obj1, obj2) {
        var i = 0, result = 0,
        numberOfProperties = sortDictS.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(sortDictS[i])(obj1, obj2);
            i++;
        }
        return result;
    }
  }

})();
