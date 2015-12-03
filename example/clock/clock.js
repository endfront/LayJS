
LAY.formation("circular",
  {radius: null},
  function ( f, filteredLevel, filteredLevelS, fargs) {
    var angle = ( (f-1) * ( 360 / filteredLevelS.length ) ) - 90;
    var firstLevelPathName = filteredLevelS[ 0 ].path();
    var originX = LAY.take(firstLevelPathName, "centerX");
    var originY = LAY.take(firstLevelPathName, "centerY").add(
      fargs.radius );
    var degreesToRadian = Math.PI / 180;
    var paramX = fargs.radius * Math.cos(angle*degreesToRadian);
    var paramY = fargs.radius * Math.sin(angle*degreesToRadian);

    return [originX.add(paramX).minus(
      LAY.take("", "$midpointX")),
       originY.add(paramY).minus(LAY.take("", "$midpointY"))];

  }
);

LAY.run({
  props: {
    backgroundColor: LAY.rgb(220,210,210),
    userSelect: "none"
  },
  "Clock": {
    $load: function () {
      var self = this;
      function updateClock() {
        LAY.clog();
        var date = new Date();
        self.data("seconds", date.getSeconds());
        self.data("minutes", date.getMinutes());
        self.data("hours", date.getHours());
        LAY.unclog();
      }
      setInterval( updateClock, 1000 );
    },
    data: {
      seconds: (new Date()).getSeconds(),
      minutes: (new Date()).getMinutes(),
      hours: (new Date()).getHours()
    },
    props: {
      width:LAY.take("../", "width").divide(2),
      height:LAY.take("","width"),
      centerX: LAY.take("../", "$midpointX" ),
      centerY: LAY.take("../", "$midpointY" ),
      backgroundColor:LAY.color("black"),
      cornerRadius: LAY.take("", "width").divide(5)
    },
    "View": {
      props: {
        width:LAY.take("../", "width").multiply(0.8),
        height:LAY.take("","width"),
        centerX: LAY.take("../", "$midpointX"),
        centerY: LAY.take("../", "$midpointY"),
        backgroundColor: LAY.color("white"),
        cornerRadius: LAY.take("", "width")
      },
      "Axis": {
        props: {
          width: LAY.take("/", "width").divide(40),
          height: LAY.take("", "width"),
          centerX: LAY.take("../", "$midpointX"),
          centerY: LAY.take("../", "$midpointY"),
          zIndex:"3",
          cornerRadius: LAY.take("", "width"),
          backgroundColor: LAY.color("red"),
          border: {style:"solid",
            width: LAY.take("", "width").divide(4),
            color: LAY.color("black")}
        }
      },
      "_Hand": {
        data: {
          tailLength: 0,
          length: 0,
          angle: 0
        },
        props: {
          height: LAY.take("",
            "data.length").plus(
            LAY.take("","data.tailLength")),
          centerX: LAY.take("../", "$midpointX"),
          top: LAY.take("../", "$midpointY").minus(
            LAY.take("", "data.length")),
          originY: LAY.take(1).minus(
            LAY.take("", "data.tailLength").divide(
            LAY.take("", "height"))),
          cornerRadius:5,
          rotateZ: LAY.take("","data.angle")
        },
      },
      "Seconds": {
        $inherit: "../_Hand",
        data: {
          tailLength: LAY.take("", "data.length").divide(4),
          length: LAY.take("../Number",
            "fargs.circular.radius"),
          angle: LAY.take("../../", "data.seconds").multiply(6)
        },
        props: {
          width:LAY.take("/", "width").divide(250),
          zIndex:"4",
          backgroundColor: LAY.color("red")
        }
      },
      "Minutes": {
        $inherit: "../_Hand",
        data: {
          length: LAY.take("../Number",
            "fargs.circular.radius").multiply(0.93),
          angle: 
            LAY.take("../../", "data.minutes").multiply(6).add(
              LAY.take("../../", "data.seconds").divide(10))
        },
        props: {
          width:LAY.take("/", "width").divide(200),
          backgroundColor: LAY.color("black"),
          zIndex:"2"
        }
      },
      "Hours": {
        $inherit: "../_Hand",
        data: {
          length: LAY.take("../Number",
            "fargs.circular.radius").multiply(0.65),
          angle: 
            LAY.take("../../", "data.hours").remainder(
              12).multiply(30).add(
                LAY.take("../../", "data.minutes").divide(2))
        },
        props: {
          width:LAY.take("../Minutes", "width"),
          backgroundColor: LAY.color("black"),
          zIndex:"2"
        }
      },
      "Number": {
        many: {
          rows: [ 12,1,2,3,4,5,6,7,8,9,10,11 ],
          sort: [{key:"id"}],
          formation: "circular",
          fargs: {
            circular: {
             radius: LAY.take("../", "$midpointY").minus(
              LAY.take("../Number:1", "$midpointY"))
           }
          }
        },
        props: {
          centerX: LAY.take("../", "$midpointX"),
          textSize: LAY.take("/", "width").divide(20),
          height: LAY.take("", "textSize").multiply(
            LAY.take("", "textLineHeight")),
          textLineHeight: 1.4,
          cursor: "default",
          text: LAY.take("", "row.content")
        }
      }
    }
  }  

});