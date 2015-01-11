( function () {
  "use strict";
  function LinearTransition ( startCalcVal, duration, delay, done, args ) {

    this.startCalcVal = startCalcVal;
    this.curTime = 0;
    this.duration = duration;
    this.done = done;

  }

  LinearTransition.prototype.generateNext = function ( delta ) {
    return ( this.duration / ( this.curTime += delta ) );
  };

  LinearTransition.prototype.checkIsComplete = function () {
    return this.curTime >= this.duration;
  };


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

  LAID.$transitionType2fn = {
    linear: function ( startCalcVal, duration, delay, done, args ) {
      return new LinearTransition( startCalcVal, duration, delay, done, args );
    },
    "cubic-bezier": function ( startCalcVal, duration, delay, done, args ) {
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
    }
  };






})();
