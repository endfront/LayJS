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
      lazyVal,
      parentLevelRootProps,
      takeWindowWidth = LAY.take("", "$windowWidth"),
      takeWindowHeight = LAY.take("", "$windowHeight"),
      takeNaturalWidth = LAY.take("", "$naturalWidth"),
      takeNaturalHeight = LAY.take("", "$naturalHeight"),
      takeParentWidth = LAY.take("../", "width");


    for ( stateName in states ) {
      state = states[ stateName ];
      props = state.props;
      when = state.when;
      transition = state.transition;
      metaMax = state.$$max;

      for ( prop in props ) {
        if ( isRootLevel ) {
          if ( props.top || props.left || props.width || props.height ) {
            throw "LAY ERROR: Cannot set top/left/width/height of root Level";
          }
        }
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

    if ( rootStateProps.link !== undefined ) {
      if ( lson.$type === "html" ) {
        lson.$type = "link:html";
      } else {
        lson.$type = rootStateProps.text !== undefined ?
          "link:text" : "link:block";
      }
    } else if ( ( rootStateProps.text !== undefined ) &&
      ( lson.$type === undefined || lson.$type === "none" )) {
      lson.$type = "text";
    } else if ( rootStateProps.image !== undefined ) {
      lson.$type = "image";
    } else if ( rootStateProps.video !== undefined ||
        rootStateProps.videos !== undefined ) {
      lson.$type = "video";
    } else if ( rootStateProps.audio !== undefined ||
        rootStateProps.audios !== undefined ) {
      lson.$type = "audio";
    } else if ( lson.$type === undefined ) {
      lson.$type = "none";
    }




    /* Filling in the defaults here for root state lson */

    if ( rootStateProps.left === undefined ) {
      rootStateProps.left = 0;
    }
    if ( rootStateProps.top === undefined ) {
      rootStateProps.top = 0;
    }
    if ( isRootLevel ) {
      rootStateProps.width = takeWindowWidth;
      rootStateProps.height = takeWindowHeight;
    } else {
      if ( rootStateProps.width === undefined ) {
        rootStateProps.width = takeNaturalWidth;
      }
      if ( rootStateProps.height === undefined ) {
        rootStateProps.height = takeNaturalHeight;
      }
    }

  };




})();
