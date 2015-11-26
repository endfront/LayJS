( function () {
  "use strict";

  var transitionType2fn,
    epsilon = 1e-6;

  LAY.Transition = function ( type, delay, duration, args, done ) {
    this.done = done;
    this.delay = delay;
    this.transition = ( transitionType2fn[ type ] )( duration, args );

  };

  LAY.Transition.prototype.generateNext = function ( delta ) {
    return this.transition.generateNext( delta );
  };

  LAY.Transition.prototype.checkIsComplete = function () {
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

  function CubicBezierTransition ( duration, args ) {

    this.curTime = 0;
    this.duration = duration;

    this.cx = 3.0 * args.a;
    this.bx = 3.0 * (args.c - args.a) - this.cx
    this.ax = 1.0 - this.cx - this.bx
    this.cy = 3.0 * args.b;
    this.by = 3.0 * (args.d - args.b) - this.cy
    this.ay = 1.0 - this.cy - this.by

  }


  // source of cubic bezier code below:
  // facebook pop framework & framer.js
  CubicBezierTransition.prototype.generateNext = function ( delta ) {

    return this.sampleCurveY( this.solveCurveX(
       (this.curTime += delta) / this.duration
    ) );

  }

  CubicBezierTransition.prototype.checkIsComplete = function () {
    return this.curTime >= this.duration;
  };


  CubicBezierTransition.prototype.sampleCurveX = function ( t ) {
    // `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
    return ((this.ax * t + this.bx) * t + this.cx) * t;
  };

  CubicBezierTransition.prototype.sampleCurveY = function ( t ) {
    return ((this.ay * t + this.by) * t + this.cy) * t;
  };

  CubicBezierTransition.prototype.sampleCurveDerivativeX = function( t ) {
    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
  };

  CubicBezierTransition.prototype.solveCurveX = function( x ) {
      var t0, t1, t2, x2, d2, i;

      // First try a few iterations of Newton's method -- normally very fast.
      for ( t2 = x, i = 0; i < 8; i++ ) {
        x2 = this.sampleCurveX( t2 ) - x;
        if ( Math.abs( x2 ) < epsilon )
          return t2;
        d2 = this.sampleCurveDerivativeX( t2 );
        if ( Math.abs( d2 ) < 1e-6 )
          break;
        t2 = t2 - x2 / d2;
      }

      // Fall back to the bisection method for reliability.
      t0 = 0.0;
      t1 = 1.0;
      t2 = x;

      if ( t2 < t0 )
        return t0;
      if ( t2 > t1 )
        return t1;

      while ( t0 < t1 ) {
        x2 = this.sampleCurveX( t2 );
        if ( Math.abs( x2 - x ) < epsilon )
          return t2;
        if ( x > x2 )
          t0 = t2;
        else
          t1 = t2;
        t2 = ( t1 - t0 ) * .5 + t0;
      }

      // Failure.
      return t2;
  };



  transitionType2fn = {
    linear: function ( duration, args ) {
      return new LinearTransition( duration, args );
    },
    "spring": function ( duration, args ) {
      return new LAY.$springTransition( duration, args );
    },
    "cubic-bezier": function ( duration, args ) {
      return new CubicBezierTransition( duration, args );
    },
    ease: function ( duration, args ) {
      return new CubicBezierTransition( duration, {
        a: 0.25, b: 0.1, c: 0.25, d: 1
      });
    },
    "ease-in": function ( duration, args ) {
      return new CubicBezierTransition( duration, {
        a: 0.42, b: 0, c: 1, d: 1
      });
    },
    "ease-out": function ( duration, args ) {
      return new CubicBezierTransition( duration, {
        a: 0, b: 0, c: 0.58, d: 1
      });
    },
    "ease-in-out": function ( duration, args ) {
      return new CubicBezierTransition( duration, {
        a: 0.42, b: 0, c: 0.58, d: 1
      });
    }
    /*
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
