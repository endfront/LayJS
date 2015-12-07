
var NFICON = {
  "logo": "&#58832;"
};

LAY.run({
  "Header": {
    props: {
      width: LAY.take("/", "width"),
      height:50,
      zIndex:"2",
      backgroundImage:
        "linear-gradient(to bottom,rgba(0,0,0,.7) 10%,rgba(0,0,0,0))"
    },
    states: {
      "translucent": {
        onlyif: LAY.take("/Container", "$scrolledY").gt(0),
        props: {
          backgroundColor:LAY.rgba(0,0,0,0.7)
        }
      }
    },
    "Logo": {
      $load: function () {
        var self = this;
        setTimeout(function(){
          self.data("text", NFICON.logo)
        },1000);
      },
      data: {
        text: "lol"
      },
      props: {
        left: LAY.take("/", "width").multiply(0.04),
        centerY: LAY.take("../", "$midpointY"),
        text: LAY.take("", "data.text"),
        textFamily: "nf-icon",
        textSize:32,
        textColor: LAY.hex(0xE50914)
      }
    }
  },
  "Container": {
    props: {
      height:LAY.take("/", "height"),
      width:LAY.take("/", "width"),
      overflowY:"auto"
    },
    "Billboard": {
      props: {
        height:2000,
        width:LAY.take("/", "width"),
        backgroundColor:LAY.color("grey")
      },
      "Cover": {
        $type:"image",
        props: {
          width: LAY.take("/", "width"),
//          height:200,
          imageUrl: "http://cdn0.nflximg.net/images/0260/9170260.jpg"
        }
      } 
    }
  }
});
