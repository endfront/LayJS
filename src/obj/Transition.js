( function () {
  "use strict";

  var transitionType2fn;

  LAID.Transition = function ( type, startCalcValue, delay, duration, args, done ) {
    this.startCalcValue = startCalcValue;
    this.done = done;
    this.delay = delay;
    this.isStarted = false;
    this.transition = new ( transitionType2fn[ type ] )( duration, args );

  }


  LAID.Transition.prototype.generateNext = function ( delta ) {
    return this.transition.generateNext( delta );
  };

  LAID.Transition.prototype.checkIsComplete = function () {
    return this.transition.checkIsComplete();
  };

  function LinearTransition ( duration, args ) {

    this.curTime = 0;
    this.duration = duration;

  }

  LinearTransition.prototype.generateNext = function ( delta ) {
    return ( ( this.curTime += delta ) / this.duration );
  };

  LinearTransition.prototype.checkIsComplete = function () {
    return this.curTime >= this.duration;
  };

  /*
  function CubicBezierTransition ( startCalcVal, duration, delay, done, args ) {

  this.startCalcVal = startCalcVal;
  this.curTime = 0;
  this.duration = duration;
  this.done = done;
  this.args = args;

}

// TODO: complete the cubic bezier implementation
CubicBezierTransition.prototype.generateNext = function ( delta ) {
return ( this.duration / ( this.curTime += delta ) );
};

CubicBezierTransition.prototype.checkIsComplete = function () {
return this.curTime >= this.duration;
};
*/
  transitionType2fn = {
    linear: function ( startCalcVal, duration, delay, done, args ) {
      return new LinearTransition( startCalcVal, duration, delay, done, args );
    },
  /*  "cubic-bezier": function ( startCalcVal, duration, delay, done, args ) {
      return new CubicBezierTransition( startCalcVal, duration, delay, done, args );
    },
    ease: function ( startCalcVal, duration, delay, done, args ) {
      return new CubicBezierTransition( startCalcVal, duration, delay, done, {
        a: 0.25, b: 0.1, c: 0.25, d: 1
      });
    },
    "ease-in": function ( startCalcVal, duration, delay, done, args ) {
      return new CubicBezierTransition( startCalcVal, duration, delay, done, {
        a: 0.42, b: 0, c: 1, d: 1
      });
    },
    "ease-out": function ( startCalcVal, duration, delay, done, args ) {
      return new CubicBezierTransition( startCalcVal, duration, delay, done, {
        a: 0, b: 0, c: 0.58, d: 1
      });
    },
    "ease-in-out": function ( startCalcVal, duration, delay, done, args ) {
      return new CubicBezierTransition( startCalcVal, duration, delay, done, {
        a: 0.42, b: 0, c: 0.58, d: 1
      });
    }*/
  };






})();
