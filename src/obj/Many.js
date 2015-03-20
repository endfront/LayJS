(function() {
  "use strict";


  LAID.$many = function ( level, partLson ) {

    this.level = level;
    this.$partLson = partLson;

	  this.$stringHashedStates2_cachedAttr2val_ =  {};

    this.$id = level.$lson.$id;
    this.$id2level = {};

  };

  LAID.$many.prototype.$init = function () {

    var
      states = this.$partLson.states || ( this.$partLson.states = {} ),
      formationName2state = LAID.$formationName2state,
      formationName;
    

    if ( this.$id === undefined ) {

    }
    
    // initiate formations
    for ( formationName in formationName2state ) {
      states[ "formation:" + formationName ] =
        formationName2state[ formationName ];
    }

    LAID.$defaultize( this.$partLson );

  };

  LAID.$many.prototype.filter = function () {

    return new LAID.Filter( this.$attr2attrVal.rows.calcVal );
  };

  /*
  *	Update the rows by:
  * (1) Creating new levels in accordance to new rows
  * (2) Updating existing levels in accordance to changes in changed rows
  */
  LAID.$many.prototype.$updateRows = function () {
  	var 
  		rowS = this.level.$attr2attrVal.rows.calcVal.rows,
  		row,
  		id,
  		level,
  		parentLevel = this.level.parentLevel,
      updatedLevelS = [],
      newLevelS = [],
      id2level = this.$id2level,
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
  			 this.$partLson, parentLevel, this.level, row );
  			parentLevel.$childLevelS.push( level );
  			id2level[ id ] = level;

        level.$createAttrVal( "$i", i + 1 );
        level.$init();
        level.$identifyAndReproduce();

        newLevelS.push( level );

  		} else {
        // update row
        level.$attr2attrVal.$i.update( i + 1 );

  		}

      updatedLevelS.push( level );

  	}

    // solve as new levels might have been intoduced
    // after "Level.$identifyAndReproduce()"
    LAID.$solve();


    for ( i = 0, len = newLevelS.length; i < len; i++ ) {
      newLevelS[ i ].$initAllAttrs();

    }

    for ( id in id2level ) {
      level = id2level[ id ];
      if ( updatedLevelS.indexOf( level ) === -1 ) {
        level.$remove();
      }
    }


    this.$updateFormation();


  	LAID.$solve();

  };

  LAID.$many.prototype.$updateFormation = function ( ) {


/*    var
      formationObj = this.$formationName2obj[ 
        this.$attr2attrVal.formation.calcVal ],
      id, level,
      formationProp2val = formationObj.props,
      formationProp, formationPropVal, attrVal;

    for ( id in id2level ) {
      level = id2level[ id ];
      for ( formationProp in formationProp2val ) {
        formationPropVal = formationProp2val[ formationProp ];
        attrVal = formationProp2val;
        if ( !attrVal ) {
          level.$createAttrVal( formationProp, formationPropVal  );
          attrVal = level.$attr2attrVal.formationProp;
          attrVal.isFormationProp = true;
        }
        level.$attr2attrVal.
      }
    }
  */


  };

  LAID.$many.prototype.$removeLevel = function ( level ) {

    this.$id2level[ id ] = null;

  };

  LAID.$many.prototype.$updateSort = function () {
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
