( function () {
  "use strict";

  var
    nonRootEssentialProp2defaultValue,
    rootEssentialProp2defaultValue,
    lazyProp2defaultValue;


  LAY.$defaultizePartLson = function ( lson, parentLevel ) {
    var
      essentialProp,
      rootState = lson.states.root,
      rootStateProps = rootState.props,
      rootStateWhen = rootState.when,
      rootStateTransition = rootState.transition,
      props,
      states = lson.states,
      stateName, state,
      prop,
      when, transition, metaMax, maxProp,
      eventType, transitionProp,
      isRootLevel = parentLevel === undefined,
      essentialProp2defaultValue = parentLevel ?
        nonRootEssentialProp2defaultValue : 
        rootEssentialProp2defaultValue,
      lazyVal,
      parentLevelRootProps;

      /* Filling in the defaults here for root state lson */

    for ( essentialProp in essentialProp2defaultValue ) {
      if ( rootStateProps[ essentialProp ] === undefined ) {
        rootStateProps[ essentialProp ] =
          essentialProp2defaultValue[ essentialProp ];
      }
    }
  

    if ( states ) {
      for ( stateName in states ) {
        state = states[ stateName ];
        props = state.props;
        when = state.when;
        transition = state.transition;
        metaMax = state.$$max;

        for ( prop in props ) {

          if (rootStateProps[ prop ] === undefined ) {
            lazyVal = LAY.$getLazyPropVal( prop,
              isRootLevel );
            if ( lazyVal !== undefined ) {
              rootStateProps[ prop ] = lazyVal;
            }
          }
        }
      }

      for ( maxProp in metaMax ) {
        lson.$$max = lson.$$max || {};

        if ( !lson.$$max[ maxProp ] ) {
          lson.$$max[ metaMax ] = metaMax[ maxProp ];
        }
      }

      for ( eventType in when ) {
        if ( !rootStateWhen[ eventType ] ) {
          rootStateWhen[ eventType ] = [];
        }
      }

      for ( transitionProp in rootStateTransition ) {
        if ( !rootStateTransition[ transitionProp ] )  {
          rootStateTransition[ transitionProp ] = {};
        }
      }
    }

    if ( !isRootLevel ) {
      // If the parent has an inheritable prop
      // then create a prop within the root of
      // the child's root props which can inherit
      // in the case that the prop hasn't already
      // been declared within the (child's root) props
      parentLevelRootProps = parentLevel.lson.states.root.props;
      for ( prop in parentLevelRootProps ) {
        if ( rootStateProps[ prop ] === undefined &&
         LAY.$inheritablePropS.indexOf( prop ) !== -1 ) {
          rootStateProps[ prop ] = LAY.$getLazyPropVal( prop );
        }
      }
    }

    if ( rootStateProps.text !== undefined &&
        ( lson.$type === undefined || lson.$type === "none" ) ) {
      lson.$type = "text";
    } else if ( lson.$type === undefined ) {
      lson.$type = "none";
    }

  };



  rootEssentialProp2defaultValue = {
    top: 0,
    left: 0,
    width: LAY.take("", "$windowWidth"),
    height: LAY.take("", "$windowHeight")
  };


  nonRootEssentialProp2defaultValue = {
    top: 0,
    left: 0,
    width: LAY.take("", "$naturalWidth"),
    height: LAY.take("", "$naturalHeight")
  };



})();
